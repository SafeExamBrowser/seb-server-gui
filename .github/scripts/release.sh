#!/usr/bin/env bash
# The release buttons (release-latest.yml, release-stable.yml). Publishes the image the nightly
# e2e passed on a line (<line>-tested) under version names, and tags the commit it was built from.
# Never builds anything. See .github/PIPELINE.md.
#
#   release.sh target
#       Where the buttons publish: writes registry (host of the public image) and official (true
#       for the official image, false for a rehearsal) to $GITHUB_OUTPUT.
#   release.sh latest | stable
#       1. Pins <line>-tested by digest and reads the commit it was built from.
#       2. Gives it a version vX.Y.Z: the one it got from an earlier release, else the next free
#          one (stable: or the one typed). An image never gets two versions.
#       3. Git: an annotated tag vX.Y.Z on that commit if the version is new; stable also moves
#          the tag vX.Y-stable there. First, so a refused push changes nothing.
#       4. Publishes it as vX.Y.Z and moves the pointers there:
#            latest  vX.Y-latest
#            stable  vX.Y-stable and vX.Y-latest
#       Safe to run again after a failure: what's already done is skipped.
#
# Env:
#   GITHUB_REF    the branch the button runs on (refs/heads/dev-x.y)
#   DRY_RUN       true (default) only shows what would happen; false releases
#   VERSION       stable, optional: the version to use instead of the next free one
#   COMMIT        stable, optional: the commit uat signed off; refuses if <line>-tested is another
#   PUBLIC_IMAGE  repo variable, optional: anything but the official image is a rehearsal. Its git
#                 tags get the prefix rehearsal/, so the real ones stay untouched; its versions
#                 continue from the real ones.
#   APP_SLUG      the release App's name (steps.app.outputs.app-slug): the tags' author
#   GH_TOKEN      a token that may read the repo's workflows (actions: read)
# Needs docker logged in to ghcr (read) and to the public registry (write), and a checkout of the
# line with all tags and the release App's credentials: the workflow's own token may not push a
# tag on a commit whose .github/workflows/ differs from every branch tip, which a tested commit's
# often does (see PIPELINE.md).
set -euo pipefail

here=$(dirname "$0")
# shellcheck source-path=SCRIPTDIR source=images.sh
. "$here/images.sh"

fail() {
  echo "::error::$*" >&2
  exit 1
}

public=$(public_image)
if [[ $public == "$(official_image)" ]]; then
  official=true
  prefix=
else
  official=false
  prefix=rehearsal/
fi
summary=${GITHUB_STEP_SUMMARY:-/dev/null}

# The digest of an image, or nothing if it doesn't exist. Any other error (no access) stops.
digest_of() {
  local out
  if out=$(docker buildx imagetools inspect "$1" --format '{{.Manifest.Digest}}' 2>&1); then
    echo "$out"
  elif ! grep -qi 'not found' <<<"$out"; then
    fail "Can't read $1: $out"
  fi
}

# Writes a line to the log and the run's summary.
say() {
  echo "$*"
  echo "$*" >>"$summary"
}

target() {
  if [[ ! $public =~ ^([a-z0-9-]+(\.[a-z0-9-]+)+|localhost)(:[0-9]+)?/[a-z0-9._/-]+$ ]]; then
    fail "PUBLIC_IMAGE has to be a full image name like docker.io/<account>/seb-server-gui," \
      "not '$public'."
  fi
  {
    echo "registry=${public%%/*}"
    echo "official=$official"
  } >>"$GITHUB_OUTPUT"
  if ! $official; then
    echo "::notice::Rehearsal: publishes to $public, git tags get the prefix $prefix." \
      "Remove the repo variable PUBLIC_IMAGE to publish to $(official_image)."
  fi
}

# The line's versions with a git tag, newest first: the real ones, while rehearsing also the
# rehearsal ones (without the prefix).
versions() {
  local pattern="^v${xy//./\\.}\\.(0|[1-9][0-9]*)\$"
  if [[ -n $prefix ]]; then
    pattern="^($prefix)?${pattern#^}"
  fi
  git tag -l | grep -E "$pattern" | sed "s|^$prefix||" | sort -urV || true
}

# What a name on the public image points at now: a version, or why not.
describe() {
  local now v d
  now=$(digest_of "$public:$1")
  if [[ -z $now ]]; then
    echo "nothing"
    return
  fi
  for v in $(versions | head -10); do
    d=$(digest_of "$public:$v")
    if [[ $d == "$now" ]]; then
      echo "$v"
      return
    fi
  done
  echo "an image without a version (${now:7:12})"
}

# Whether the workflow file on stdin starts on a tag push: on create, on push without a filter,
# or on push with a tags filter. A push with only a branches filter doesn't.
starts_on_tags() {
  awk '
    function decide() {
      if (event == "create" || (event == "push" && (tags || !branches))) yes = 1
    }
    /^on:/ {
      on = 1
      rest = $0
      sub(/^on:[ \t]*/, "", rest)
      sub(/#.*/, "", rest)
      if (rest ~ /(^|[^a-z_-])(push|create)([^a-z_-]|$)/) yes = 1
      next
    }
    !on || /^[ \t]*(#.*)?$/ { next }
    /^[^ \t]/ { exit }
    {
      match($0, /^[ \t]*/)
      if (!level) level = RLENGTH
      if (RLENGTH == level) {
        decide()
        event = $0
        sub(/^[ \t]*(- )?/, "", event)
        sub(/[ \t]*(:.*|#.*)?$/, "", event)
        tags = branches = 0
      } else if ($0 ~ /^[ \t]*tags(-ignore)?:/) {
        tags = 1
      } else if ($0 ~ /^[ \t]*branches(-ignore)?:/) {
        branches = 1
      }
    }
    END {
      decide()
      exit !yes
    }
  '
}

# A tag pushed by the release App starts every workflow of the tagged commit that listens to tag
# pushes. The legacy ones rebuild from source and publish to the official image under the tag's
# name, so each of them has to be disabled (Actions › the workflow › ⋯ › Disable workflow).
# Deleting its file isn't enough: the tagged commit still has it.
check_tag_workflows() {
  local f state blocking=()
  for f in $(git ls-tree --name-only "$revision" .github/workflows/); do
    if git show "$revision:$f" | starts_on_tags; then
      state=$(gh api "repos/$GITHUB_REPOSITORY/actions/workflows/${f##*/}" --jq .state 2>/dev/null) ||
        state="unknown to GitHub"
      if [[ $state != disabled_manually ]]; then
        blocking+=("${f##*/} ($state)")
      fi
    fi
  done
  if ((${#blocking[@]})); then
    fail "The git tags would start ${blocking[*]}, which can publish to $(official_image)." \
      "Disable it first: Actions › the workflow › ⋯ › Disable workflow."
  fi
}

# Gives the pinned image the name <public>:<name>, unless it has it already.
copy() {
  local to=$public:$1 now
  now=$(digest_of "$to")
  if [[ $now == "$digest" ]]; then
    return
  fi
  changed=true
  # --prefer-index=false copies the image as it is; otherwise a plain image gets wrapped in a new
  # index with a different digest.
  docker buildx imagetools create --prefer-index=false --tag "$to" "$image" ||
    fail "Copying to $to failed. Run the button again: it continues where it stopped."
  now=$(digest_of "$to")
  if [[ $now != "$digest" ]]; then
    fail "$to has another digest after copying (${now:-none}), not $digest."
  fi
}

release() {
  local kind=$1 line dry tested signed own last versioned have current='' pointers name
  local -A from
  if [[ ! ${GITHUB_REF:-} =~ ^refs/heads/(dev-([0-9]+\.[0-9]+))$ ]]; then
    fail "Run the button on a release line (Use workflow from: dev-x.y), not on '${GITHUB_REF:-}'."
  fi
  line=${BASH_REMATCH[1]}
  xy=${BASH_REMATCH[2]}
  # Typed inputs, without stray spaces from copy and paste.
  VERSION=${VERSION:-}
  VERSION=${VERSION//[[:space:]]/}
  COMMIT=${COMMIT:-}
  COMMIT=${COMMIT//[[:space:]]/}
  dry=${DRY_RUN:-true}
  if [[ $dry != true && $dry != false ]]; then
    fail "DRY_RUN is true or false, not '$dry'."
  fi

  # 1. Pin the image, so the nightly moving <line>-tested meanwhile can't change what's released.
  tested="$(internal_image):$line-tested"
  digest=$(digest_of "$tested")
  if [[ -z $digest ]]; then
    fail "There's no $tested: the nightly e2e hasn't passed on $line yet."
  fi
  image="$(internal_image)@$digest"
  revision=$(docker buildx imagetools inspect "$image" \
    --format '{{index .Image.Config.Labels "org.opencontainers.image.revision"}}')
  if [[ ! $revision =~ ^[0-9a-f]{40}$ ]]; then
    fail "$image has no commit in its label org.opencontainers.image.revision."
  fi
  if ! git merge-base --is-ancestor "$revision" HEAD 2>/dev/null; then
    fail "$tested was built from ${revision:0:8}, which isn't on $line."
  fi
  if [[ -n ${COMMIT:-} ]]; then
    signed=$(git rev-parse --quiet --verify "$COMMIT^{commit}") ||
      fail "There's no commit '$COMMIT'."
    if [[ $signed != "$revision" ]]; then
      fail "uat signed off ${signed:0:8}, but $line-tested is ${revision:0:8} now." \
        "Have uat check ${revision:0:8} first, or leave the commit empty."
    fi
  fi

  # 2. The version.
  own=$(git tag --points-at "$revision" | grep -E "^${prefix}v${xy//./\\.}\\.(0|[1-9][0-9]*)\$" |
    sort -V | tail -1) || true
  if [[ -n $own ]]; then
    version=${own#"$prefix"}
    new=false
    if [[ -n ${VERSION:-} && $VERSION != "$version" ]]; then
      fail "This image is $version already, so it can't become $VERSION too."
    fi
  elif [[ -n ${VERSION:-} ]]; then
    if [[ ! $VERSION =~ ^v${xy//./\\.}\.(0|[1-9][0-9]*)$ ]]; then
      fail "'$VERSION' isn't a version of $line (v$xy.<number>)."
    fi
    if versions | grep -qx "$VERSION"; then
      fail "$VERSION is taken already."
    fi
    version=$VERSION
    new=true
  else
    last=$(versions | head -1)
    if [[ -n $last ]]; then
      version=v$xy.$((${last##*.} + 1))
    else
      version=v$xy.0
    fi
    new=true
  fi
  versioned=$public:$version
  have=$(digest_of "$versioned")
  if [[ -n $have && $have != "$digest" ]]; then
    fail "$versioned exists already and is another image (${have:7:12}). Versions are never" \
      "overwritten: Release stable can take another version."
  fi

  stable_tag=${prefix}v$xy-stable
  if [[ $kind == stable ]] && current=$(git rev-parse --quiet --verify "refs/tags/$stable_tag^{commit}"); then
    if ! git merge-base --is-ancestor "$current" "$revision"; then
      fail "$stable_tag is on ${current:0:8}, which $line-tested (${revision:0:8}) doesn't" \
        "contain. Stable never goes back."
    fi
  fi

  if [[ $kind == stable ]]; then
    pointers=("v$xy-stable" "v$xy-latest")
  else
    pointers=("v$xy-latest")
  fi
  for name in "${pointers[@]}"; do
    from[$name]=$(describe "$name")
    if [[ ${from[$name]} =~ ^v[0-9] && ${from[$name]} != "$version" &&
      $(printf '%s\n' "${from[$name]}" "$version" | sort -V | tail -1) != "$version" ]]; then
      fail "$name is ${from[$name]}, newer than $version. Pointers never go back."
    fi
  done

  if $new || [[ $kind == stable && $current != "$revision" ]]; then
    check_tag_workflows
  fi

  # The plan.
  if [[ $dry == true ]]; then
    say "### Dry run: Release $kind on $line (nothing changes)"
  else
    say "### Release $kind on $line"
  fi
  say
  if ! $official; then
    say "Rehearsal (repo variable PUBLIC_IMAGE). Official image: $(official_image)."
    say
  fi
  say "- image: \`$image\` ($line-tested)"
  say "- commit: \`$revision\`"
  if $new; then
    say "- version: **$version**, new"
  else
    say "- version: **$version**, which the image has from an earlier release"
  fi
  say "- \`$public\`:"
  if [[ -z $have ]]; then
    say "  - $version: new"
  else
    say "  - $version: there already"
  fi
  for name in "${pointers[@]}"; do
    say "  - $name: ${from[$name]} → $version"
  done
  say "- git tags:"
  if $new; then
    say "  - $prefix$version: new, on ${revision:0:8}"
  fi
  if [[ $kind == stable ]]; then
    if [[ -n $current ]]; then
      say "  - $stable_tag: ${current:0:8} → ${revision:0:8}"
    else
      say "  - $stable_tag: new, on ${revision:0:8}"
    fi
  fi
  if [[ $kind == latest ]] && ! $new; then
    say "  - none"
  fi

  if [[ $dry == true ]]; then
    say
    say "Dry run: nothing changed. Run it again without dry run to release."
    return
  fi

  # 3. The git tags, first: if the push is refused, nothing has changed. Pushed as the release
  # App, so they start the workflows check_tag_workflows looked at.
  changed=false
  local refs=() run=${GITHUB_SERVER_URL:-}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-}
  local bot="${APP_SLUG:-}[bot]" id
  if [[ -z ${APP_SLUG:-} ]]; then
    fail "APP_SLUG is empty: the workflow passes the release App's name."
  fi
  id=$(gh api "users/$bot" --jq .id) || fail "Can't find the GitHub user $bot."
  git config user.name "$bot"
  git config user.email "$id+$bot@users.noreply.github.com"
  if $new; then
    git tag --annotate --message "Release $kind $version

Image:  $versioned
Digest: $digest
Tested: $tested (nightly e2e)
Run:    $run" "$prefix$version" "$revision"
    refs+=("refs/tags/$prefix$version")
  fi
  if [[ $kind == stable && ${current:-} != "$revision" ]]; then
    git tag --force --annotate --message "$stable_tag = $version

Run: $run" "$stable_tag" "$revision" >/dev/null
    refs+=("+refs/tags/$stable_tag")
  fi
  if ((${#refs[@]})); then
    if ! git push --atomic origin "${refs[@]}"; then
      fail "Pushing the git tags failed, so nothing changed: $public is as it was."
    fi
    changed=true
  fi

  # 4. The public names. The version first, so a pointer never points at an image without one.
  # If a copy fails, running the button again continues: the version is on the commit's tag now.
  copy "$version"
  for name in "${pointers[@]}"; do
    copy "$name"
  done

  say
  if $changed; then
    say "Released. Now: v$xy-stable = $(describe "v$xy-stable"), v$xy-latest = $(describe "v$xy-latest")."
  else
    say "Nothing to do: everything was there already. v$xy-stable = $(describe "v$xy-stable")," \
      "v$xy-latest = $(describe "v$xy-latest")."
  fi
}

case ${1:-} in
  target) target ;;
  latest | stable) release "$1" ;;
  *)
    echo "Usage: $0 target | latest | stable" >&2
    exit 2
    ;;
esac
