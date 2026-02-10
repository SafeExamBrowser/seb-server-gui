#!/bin/bash

set -e

# Go to repo root (parent of the github folder)
cd "$(dirname "$0")/.."

TAG_NAME="auto-testing-deploy"

echo "Deleting local tag..."
git tag -d $TAG_NAME 2>/dev/null || true

echo "Creating new tag..."
git tag $TAG_NAME

echo "Deleting remote tag..."
git push origin :refs/tags/$TAG_NAME 2>/dev/null || true

echo "Pushing new tag..."
git push origin $TAG_NAME

echo "Auto testing deployment tag pushed successfully."
