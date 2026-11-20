# Image names of the pipeline, in one place. Source it, don't run it:
#   . .github/scripts/images.sh
# See .github/PIPELINE.md.

# Builds and tested builds (development, dev-3.0, development-tested, …): private, on ghcr,
# named after this repo. Lower-cased because ghcr requires it. A fork gets its own.
internal_image() {
  echo "ghcr.io/${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is not set}" | tr '[:upper:]' '[:lower:]'
}

# Released versions (v3.0.3, v3.0-stable, v3.0-latest): public, on Docker Hub. The repo
# variable PUBLIC_IMAGE overrides it, so a fork can rehearse releases on its own ghcr.
public_image() {
  echo "${PUBLIC_IMAGE:-docker.io/sebadmin/seb-server-gui}"
}
