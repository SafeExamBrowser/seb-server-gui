#!/bin/bash

set -e

# LEGACY: see README.md next to this script. Moves the git tag sprint-testing to the
# current commit, which makes legacy-tag-build.yml rebuild and push
# sebadmin/seb-server-gui:sprint-testing. Formerly github/deploy-auto-testing.sh.

# Go to repo root (two levels up from .github/legacy)
cd "$(dirname "$0")/../.."

TAG_NAME="sprint-testing"

echo "Deleting local tag..."
git tag -d $TAG_NAME 2>/dev/null || true

echo "Creating new tag..."
git tag $TAG_NAME

echo "Deleting remote tag..."
git push origin :refs/tags/$TAG_NAME 2>/dev/null || true

echo "Pushing new tag..."
git push origin $TAG_NAME

echo "Auto testing deployment tag pushed successfully."
