#!/usr/bin/env bash
# Deletes old untagged versions of this repo's ghcr image, keeping the newest $KEEP (default 20).
# A version loses its tag when a newer build takes the name over (development, dev-3.0, …), and
# private package storage counts against the org's quota. Tagged versions (every current name,
# including the -tested ones) are never touched. Called by build.yml; see .github/PIPELINE.md.
#
# Safe only because build.yml pushes plain images (provenance: false, sbom: false). With
# attestations, each image is an index whose parts are untagged versions of their own, and
# deleting those would break the tagged image.
#
# Needs GITHUB_REPOSITORY and GH_TOKEN (permission to delete versions of the package).
set -euo pipefail

keep=${KEEP:-20}
owner=${GITHUB_REPOSITORY%%/*}
package=$(echo "${GITHUB_REPOSITORY#*/}" | tr '[:upper:]' '[:lower:]')

# The package belongs to an organisation here, to a user in a fork.
if [[ $(gh api "users/$owner" -q .type) == Organization ]]; then
  versions="orgs/$owner/packages/container/$package/versions"
else
  versions="users/$owner/packages/container/$package/versions"
fi

# Untagged versions, newest first; everything after the first $keep goes.
old=$(gh api --paginate "$versions?per_page=100" \
  -q '.[] | select((.metadata.container.tags | length) == 0) | [.created_at, .id] | @tsv' |
  sort -r | tail -n +$((keep + 1)) | cut -f2)

if [[ -z $old ]]; then
  echo "Nothing to delete (at most $keep untagged versions)."
  exit 0
fi

deleted=0
for id in $old; do
  # A build of another branch may have deleted it a moment ago.
  if ! out=$(gh api -X DELETE "$versions/$id" 2>&1); then
    if [[ $out == *"404"* ]]; then
      continue
    fi
    echo "::error::Couldn't delete version $id of $package: $out"
    exit 1
  fi
  deleted=$((deleted + 1))
done
echo "Deleted $deleted old untagged version(s), kept the newest $keep."
