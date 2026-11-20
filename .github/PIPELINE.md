# CI/CD pipeline

How images of the GUI are built, tested and released. In short: **pushes build, nights test,
buttons publish.** Every push to `development` or a release line (`dev-x.y`) builds one image.
Testing and releasing only add names to that image; it's never rebuilt, so what was tested is
byte for byte what gets released.

The pipeline is being built in stages. Rows marked **not built yet** are planned; rows marked
**placeholder** exist but wait for the servers; **legacy** is the old way, kept until the new
one has released once.

## Workflows

| File                                       | Runs on                                      | Does                                                                                                       |
| ------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `workflows/pr.yml`                         | PRs into `development` and `dev-x.y`         | Required checks `client`, `server`, `e2e` (mocked suite)                                                   |
| `workflows/allowed-source.yml`             | every PR                                     | Required check: which branch may be merged into which                                                      |
| `workflows/build.yml`                      | push to `development` and `dev-x.y`          | Scan, build, push `ghcr…:<branch>`; delete old untagged versions                                           |
| `workflows/nightly-e2e.yml`                | **not built yet** (every night, or by hand)  | One line after the other: test the newest image, ✓/✗ on its commit; if green, move `<branch>-tested` to it |
| `workflows/release-latest.yml`             | **not built yet** (button, from a `dev-x.y`) | Publish `dev-x.y-tested` as `vX.Y-latest` on Docker Hub                                                    |
| `workflows/release-stable.yml`             | **not built yet** (button, from a `dev-x.y`) | Publish `dev-x.y-tested` as `vX.Y.Z`, `vX.Y-stable`, `vX.Y-latest`; git tags `vX.Y.Z` and `vX.Y-stable`    |
| `workflows/legacy-tag-build.yml`           | **legacy**: any tag push                     | Rebuilds from the tagged commit and pushes `sebadmin/seb-server-gui:<tag>` to Docker Hub                   |
| `workflows/legacy-auto-testing-deploy.yml` | **legacy**: tag `auto-testing-deploy`        | Rebuilds `sebadmin/seb-server-gui-auto-testing`                                                            |

## Images

Builds and tested builds are private, on ghcr. Releases are public, on Docker Hub, where the
servers and the institutions running the GUI on Kubernetes pull them from.

| Name                                   | Where                                             | Moved by                                | Used by                                 |
| -------------------------------------- | ------------------------------------------------- | --------------------------------------- | --------------------------------------- |
| `development`, `dev-x.y`               | `ghcr.io/safeexambrowser/seb-server-gui`, private | every push (`build.yml`)                | dev (playground), nightly e2e           |
| `development-tested`, `dev-x.y-tested` | `ghcr.io/safeexambrowser/seb-server-gui`, private | a green nightly run (**not built yet**) | uat                                     |
| `vX.Y-latest`                          | `docker.io/sebadmin/seb-server-gui`, public       | Release latest and Release stable       | anyone who wants the newest tested X.Y  |
| `vX.Y.Z`                               | `docker.io/sebadmin/seb-server-gui`, public       | Release stable, never moves             | prod, institutions pinning a version    |
| `vX.Y-stable`                          | `docker.io/sebadmin/seb-server-gui`, public       | Release stable                          | institutions following the newest patch |

There's deliberately no plain `latest`, so pulling without a tag never gets a test build.

Every image built by `build.yml` records the commit it was built from in the label
`org.opencontainers.image.revision`. To see it (ghcr is private: log in with a token that has
`read:packages`, e.g. `gh auth refresh -s read:packages` first):

```sh
gh auth token | docker login ghcr.io -u <github-user> --password-stdin
docker pull ghcr.io/safeexambrowser/seb-server-gui:development
docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' \
  ghcr.io/safeexambrowser/seb-server-gui:development
```

## Scripts

| File                       | Does                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `scripts/images.sh`        | The image names, in one place (sourced by the workflows)                               |
| `scripts/ghcr-cleanup.sh`  | Deletes old untagged ghcr versions, keeps the newest 20; tagged ones are never touched |
| `scripts/e2e-on-server.sh` | **Placeholder**: deploy one image to the e2e server and run the full suite against it  |

## Placeholders

These wait for the servers. Each has one switch, so nothing else needs to change.

| What                                                                  | Needs                                                                                  | Switch                          |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------- |
| `scripts/e2e-on-server.sh`                                            | how a job deploys an exact image to the e2e server and resets its data; the full suite | repo variable `E2E_MODE=server` |
| Where the nightly e2e runs                                            | GitHub-hosted if the e2e server is reachable, else our own runner inside ETH           | `runs-on` in `nightly-e2e.yml`  |
| Servers: dev on `development`, uat on `-tested`, pull secret for ghcr | Rancher setup (sysadmins)                                                              | nothing in this repo            |

Until `E2E_MODE=server`, the nightly e2e will start the image inside the GitHub runner and run
the mocked suite against it (commit status `e2e/image`). With the server it runs the full
suite (commit status `e2e/full`).

## Legacy: what gets deleted, and when

Kept until the first release has gone through the Release stable button. Then:

1. Tell whoever maintains `seb-server-setup`: it references the Docker Hub names `demo` and
   `sprint-testing`, which nothing updates any more after this.
2. Delete `workflows/legacy-tag-build.yml`, `workflows/legacy-auto-testing-deploy.yml` and
   `legacy/`, on `development` and every `dev-x.y`.
3. Add a tag ruleset to `rulesets/`: version tags `vX.Y.Z` can't be moved or deleted
   (`vX.Y-stable` still moves).
4. Delete the unused secret `DOCKERHUB_PASSWORD`.
5. Update this file.

Until step 2, every tag pushed by a person still starts `legacy-tag-build.yml` and rebuilds the
Docker Hub name of that tag. Once the buttons exist, don't push release tags by hand. (Tags
pushed by a workflow with `GITHUB_TOKEN` don't start other workflows.)

## Rules for files in `.github/`

- **Byte-identical on `development` and every `dev-x.y`.** Otherwise back-merges conflict.
  Copy with `git checkout origin/development -- <file>` on a branch cut from `dev-x.y`.
- **Workflow files stay flat in `workflows/`**: GitHub doesn't read subfolders. Scripts go to
  `scripts/`.
- **New job names must not be `client`, `server`, `e2e` or `allowed-source`**: those are the
  required PR checks (`rulesets/README.md`).
- **No `paths:` or `branches:` filters on required checks**: a skipped required check stays
  pending and blocks the merge.
- **A self-hosted runner must never take pull-request workflows** (public repo, fork PRs):
  only scheduled and manual ones.
- **Not `.github/README.md`**: GitHub would show it instead of the repo's README.
