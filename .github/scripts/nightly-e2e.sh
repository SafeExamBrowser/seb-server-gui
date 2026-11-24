#!/usr/bin/env bash
# The nightly e2e, per line (development, dev-3.0, …). Called by nightly-e2e.yml, which checks out
# the tested commit, installs it and uploads the report in between. See .github/PIPELINE.md.
#
#   nightly-e2e.sh lines
#       The lines to test, as JSON: development, then every dev-x.y branch.
#   nightly-e2e.sh pin <line>
#       1. Pins the line's image by digest and reads the commit it was built from, so a push during
#          the run can't change what's tested. 2. Says to skip if that commit already has a result.
#          Writes image (name@digest), revision and test (true/false) to $GITHUB_OUTPUT.
#   nightly-e2e.sh test <image@digest> <client dir>
#       3. Tests exactly that image, with the e2e tests in <client dir> (the tested commit's client/).
#   nightly-e2e.sh report <line> <image@digest> <revision> <outcome of test>
#       4. ✓/✗ on the commit. 5. Only if green: gives the image the name <line>-tested too.
#
# The repo variable E2E_MODE picks how step 3 tests:
#   image (default)  runs the image inside the runner and the mocked suite against it. Commit
#                    status e2e/image.
#   server           deploys the image to the e2e server and runs the full suite there
#                    (e2e-on-server.sh, a placeholder until the server exists). Commit status
#                    e2e/full.
#
# Needs GITHUB_REPOSITORY, GH_TOKEN (statuses: write) and docker logged in to ghcr (packages: write).
set -euo pipefail

here=$(dirname "$0")
# shellcheck source-path=SCRIPTDIR source=images.sh
. "$here/images.sh"

case ${E2E_MODE:-image} in
  image)
    context=e2e/image
    suite="Mocked suite against the image"
    ;;
  server)
    context=e2e/full
    suite="Full suite on the e2e server"
    ;;
  *)
    echo "::error::Unknown E2E_MODE '$E2E_MODE': use image or server, or remove the variable." >&2
    exit 1
    ;;
esac

summary=${GITHUB_STEP_SUMMARY:-/dev/null}

lines() {
  local branches
  branches=$(gh api --paginate "repos/$GITHUB_REPOSITORY/branches?per_page=100" -q '.[].name')
  {
    grep -x development <<<"$branches" || true
    grep -E '^dev-[0-9]' <<<"$branches" | sort -V || true
  } | jq -R -s -c 'split("\n") | map(select(. != ""))'
}

pin() {
  local line=$1 image digest revision state test=true
  image="$(internal_image):$line"
  if ! digest=$(docker buildx imagetools inspect "$image" --format '{{.Manifest.Digest}}'); then
    echo "::error::No image $image. Has build.yml run on $line yet?" >&2
    exit 1
  fi
  image="$(internal_image)@$digest"
  # Read by digest, so the commit belongs to exactly the pinned image.
  revision=$(docker buildx imagetools inspect "$image" \
    --format '{{index .Image.Config.Labels "org.opencontainers.image.revision"}}')
  if [[ ! $revision =~ ^[0-9a-f]{40}$ ]]; then
    echo "::error::$image has no commit in its label org.opencontainers.image.revision." \
      "Images from build.yml have one." >&2
    exit 1
  fi

  # Only a finished result counts. error (set up failed, cancelled) is tested again.
  state=$(gh api "repos/$GITHUB_REPOSITORY/commits/$revision/status" \
    -q ".statuses[] | select(.context == \"$context\") | .state")
  if [[ $state == success || $state == failure ]]; then
    test=false
  fi

  {
    echo "image=$image"
    echo "revision=$revision"
    echo "test=$test"
  } >>"$GITHUB_OUTPUT"
  {
    echo "### $line"
    echo
    echo "- image: \`$image\`"
    echo "- commit: \`$revision\`"
    if [[ $test == false ]]; then
      echo "- skipped: the commit already has $context $state"
    fi
  } >>"$summary"
  if [[ $test == false ]]; then
    echo "Skipped: $revision already has $context $state."
  fi
}

run_tests() {
  local image=$1 client=$2
  if [[ ${E2E_MODE:-image} == server ]]; then
    "$here/e2e-on-server.sh" "$image"
    return
  fi

  # The mocked suite answers every /api/ call in the browser, so the gateway never reaches a
  # backend. It only needs these to start. .invalid never resolves, so nothing real is called.
  docker run --detach --name nightly-e2e --publish 127.0.0.1:3001:3001 \
    --env SERVER_PORT=3001 \
    --env SEB_SERVER_URL=http://seb-server.invalid \
    --env SEB_SERVER_USERNAME=e2e --env SEB_SERVER_PASSWORD=e2e \
    --env PROCTOR_SERVER_URL=http://proctor-server.invalid \
    --env PROCTOR_SERVER_USERNAME=e2e --env PROCTOR_SERVER_PASSWORD=e2e \
    "$image" >/dev/null
  trap 'echo "::group::Gateway log"; docker logs nightly-e2e 2>&1; echo "::endgroup::"
        docker rm --force nightly-e2e >/dev/null' EXIT

  local i
  for i in $(seq 30); do
    if curl --silent --fail --output /dev/null http://localhost:3001/; then
      break
    fi
    if [[ $(docker inspect --format '{{.State.Running}}' nightly-e2e) != true || $i == 30 ]]; then
      echo "::error::The image didn't start (gateway log below)." >&2
      return 1
    fi
    sleep 1
  done

  (cd "$client" && BASE_URL=http://localhost:3001/ npm run test:e2e)
}

report() {
  local line=$1 image=$2 revision=$3 outcome=$4 tested
  local short=${image#*@sha256:}
  short=${short:0:12}

  status() {
    gh api --method POST "repos/$GITHUB_REPOSITORY/statuses/$revision" \
      -f state="$1" -f context="$context" -f description="$2" \
      -f target_url="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" >/dev/null
    echo "- $context: $1, $2" >>"$summary"
  }

  case $outcome in
    success)
      # Move the name first: a ✓ whose -tested didn't move would be skipped next night.
      # --prefer-index=false copies the image as it is; otherwise a plain image gets wrapped in a
      # new index with a different digest.
      tested="$(internal_image):$line-tested"
      if docker buildx imagetools create --prefer-index=false --tag "$tested" "$image" &&
        [[ $(docker buildx imagetools inspect "$tested" --format '{{.Manifest.Digest}}') == "${image#*@}" ]]; then
        status success "$suite $short passed. Now $line-tested."
      else
        status error "$suite $short passed, but moving $line-tested failed. Retried next run."
        echo "::error::Couldn't move $tested to $image." >&2
        exit 1
      fi
      ;;
    failure)
      status failure "$suite $short failed. $line-tested stays where it was."
      ;;
    *)
      # Set up failed or cancelled: no result, so the next run tests the commit again.
      status error "Not tested: setup failed or the run was cancelled. Retried next run."
      ;;
  esac
}

case ${1:-} in
  lines) lines ;;
  pin) pin "$2" ;;
  test) run_tests "$2" "$3" ;;
  report) report "$2" "$3" "$4" "$5" ;;
  *)
    echo "Usage: $0 lines | pin <line> | test <image@digest> <client dir> |" \
      "report <line> <image@digest> <revision> <outcome>" >&2
    exit 2
    ;;
esac
