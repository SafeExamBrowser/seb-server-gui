# shellcheck shell=bash
# Image names of the pipeline, in one place. Source it, don't run it:
#   . .github/scripts/images.sh
# See .github/PIPELINE.md.

# Builds and tested builds (development, dev-3.0, development-tested, …): private, on ghcr,
# named after this repo. Lower-cased because ghcr requires it. A fork gets its own.
internal_image() {
  echo "ghcr.io/${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is not set}" | tr '[:upper:]' '[:lower:]'
}

# Released versions (v3.0.3, v3.0-stable, v3.0-latest): public, on Docker Hub, where the servers
# and the institutions pull them from.
official_image() {
  echo docker.io/sebadmin/seb-server-gui
}

# Where the release buttons publish. The repo variable PUBLIC_IMAGE points them at another image
# to rehearse, e.g. a private Docker Hub repository (see release.sh).
public_image() {
  echo "${PUBLIC_IMAGE:-$(official_image)}"
}
