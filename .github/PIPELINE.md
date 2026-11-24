# CI/CD pipeline

How images of the GUI are built, tested and released. In short: **pushes build, nights test,
buttons publish.** Every push to `development` or a release line (`dev-x.y`) builds one image.
Testing and releasing only add names to that image; it's never rebuilt, so what was tested is
byte for byte what gets released.

The pipeline is being built in stages. Rows marked **placeholder** exist but wait for the
servers; **legacy** is the old way, kept until the new one has released once.

## Workflows

| File                                       | Runs on                               | Does                                                                                                                            |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `workflows/pr.yml`                         | PRs into `development` and `dev-x.y`  | Required checks `client`, `server`, `e2e` (mocked suite)                                                                        |
| `workflows/allowed-source.yml`             | every PR                              | Required check: which branch may be merged into which                                                                           |
| `workflows/build.yml`                      | push to `development` and `dev-x.y`   | Scan, build, push `ghcr…:<branch>`; delete old untagged versions                                                                |
| `workflows/nightly-e2e.yml`                | every night at 01:00 UTC, and by hand | One line after the other: test the newest image, ✓/✗ on its commit; if green, move `<branch>-tested` to it                      |
| `workflows/release-latest.yml`             | button, run from a `dev-x.y`          | Give `dev-x.y-tested` a version `vX.Y.Z` (its own or the next free one), publish it, move `vX.Y-latest` there; git tag `vX.Y.Z` |
| `workflows/release-stable.yml`             | button, run from a `dev-x.y`          | The same, but moves `vX.Y-stable` and `vX.Y-latest`; git tags `vX.Y.Z` and `vX.Y-stable`                                        |
| `workflows/legacy-tag-build.yml`           | **legacy**: any tag push              | Rebuilds from the tagged commit and pushes `sebadmin/seb-server-gui:<tag>` to Docker Hub                                        |
| `workflows/legacy-auto-testing-deploy.yml` | **legacy**: tag `auto-testing-deploy` | Rebuilds `sebadmin/seb-server-gui-auto-testing`                                                                                 |

## Images

Builds and tested builds are private, on ghcr. Releases are public, on Docker Hub, where the
servers and the institutions running the GUI on Kubernetes pull them from.

| Name                                   | Where                                             | Moved by                                                 | Used by                                                                        |
| -------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `development`, `dev-x.y`               | `ghcr.io/safeexambrowser/seb-server-gui`, private | every push (`build.yml`)                                 | dev (playground), nightly e2e                                                  |
| `development-tested`, `dev-x.y-tested` | `ghcr.io/safeexambrowser/seb-server-gui`, private | a green nightly e2e                                      | uat                                                                            |
| `vX.Y.Z`                               | `docker.io/sebadmin/seb-server-gui`, public       | the button that gives the image its version; never moves | prod, institutions pinning a version                                           |
| `vX.Y-stable`                          | `docker.io/sebadmin/seb-server-gui`, public       | Release stable                                           | institutions following the newest stable release                               |
| `vX.Y-latest`                          | `docker.io/sebadmin/seb-server-gui`, public       | Release latest and Release stable                        | institutions following the newest release (uat may not have signed it off yet) |

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

## Nightly e2e

Every night at 01:00 UTC, and by hand: Actions › Nightly e2e › Run workflow, from `development`.
For each line (`development`, then every `dev-x.y`), one after the other:

1. Pins the line's image by digest and reads the commit it was built from. A push during the run
   can't change what's tested.
2. Skips the line if that commit already has a ✓ or ✗. A ✗ stays until the next push to the line,
   or until a run by hand with **Test a commit with ✗ again** ticked (e.g. after a flaky failure).
   A run that couldn't test (setup failed, cancelled) writes an error instead, and the next run
   tests the commit again.
3. Checks out that commit (tests and app match), starts the image in the runner with dummy backend
   settings and runs the mocked suite against it.
4. Uploads the Playwright report (`e2e-report-<line>`, kept 30 days) and writes `e2e/image` ✓/✗
   on the commit, linking to the run.
5. Only if green: gives exactly that image (same digest) the name `<line>-tested` too.

## Releasing

Actions › **Release latest** or **Release stable** › Run workflow, with **Use workflow from:
`dev-x.y`**. **Dry run** is ticked by default: the run's summary shows what would happen
(version, image, commit, which names and tags move) and nothing changes. Untick it to release.

Both buttons take `dev-x.y-tested`, the newest image with a green nightly e2e:

1. Pin it by digest and read the commit it was built from.
2. Give it a version `vX.Y.Z`: the one it got from an earlier release, else the next free one.
   An image never gets two versions.
3. Publish it as `vX.Y.Z` and move the pointers there: Release latest moves `vX.Y-latest`,
   Release stable moves `vX.Y-stable` and `vX.Y-latest`.
4. Git: an annotated tag `vX.Y.Z` on that commit if the version is new; Release stable also moves
   the tag `vX.Y-stable` there. The tag's message says which button made it.

Release stable can also take a version (instead of the next free one) and the commit uat signed
off; it refuses if `dev-x.y-tested` is another commit by then. Both refuse if there's no
`dev-x.y-tested`, if its commit isn't on the branch, if a version on Docker Hub already holds
another image (versions are never overwritten) and if `vX.Y-latest` or `vX.Y-stable` would go back
to an older version. If a run fails halfway, run it again: it skips what's done.

Afterwards, as before: a PR `dev-x.y` → `main` as the archive (merge commit).

### Rehearsal

While the repo variable `PUBLIC_IMAGE` is set, the buttons publish there instead of
`docker.io/sebadmin/seb-server-gui`, e.g. to a private Docker Hub repository:

- `PUBLIC_IMAGE`: the full name, e.g. `docker.io/<account>/seb-server-gui`. Create the repository
  first, as private: a push would create it with the account's default visibility.
- Secrets `REHEARSAL_REGISTRY_USERNAME` and `REHEARSAL_REGISTRY_TOKEN`: the account and an access
  token with Read & Write.
- Git tags get the prefix `rehearsal/` (`rehearsal/v3.0.3`, `rehearsal/v3.0-stable`), so the real
  ones stay untouched. The versions continue from the real ones. The tag messages name the image,
  so the rehearsal account is visible in them until the tags are deleted when going live.
- In the run's log and summary, account names show as `***`: GitHub hides secret values, and the
  Docker Hub usernames are secrets. The "Rehearsal" line and the `rehearsal/` prefix say which it
  is.

To go live, see the next section.

## Going live: from the rehearsal to production

While the repo variable `PUBLIC_IMAGE` exists, every release is a rehearsal. Going live means the
buttons publish to `docker.io/sebadmin/seb-server-gui`, which the servers and the institutions
pull. For them nothing changes: the names stay the same, only what puts the images there.

**Before**

- The rehearsal worked: Release latest, then Release stable reusing that version, and a second
  run of the same button that changes nothing.
- Agreed that every button press gives the image a version, so a version number alone no longer
  means stable (see "Releasing").
- The secrets `DOCKERHUB_ADMIN_USERNAME` and `DOCKERHUB_ADMIN_TOKEN` still work and may push to
  `sebadmin/seb-server-gui`. The old release path uses them: its last run is under Actions ›
  "Legacy · any tag → Docker Hub".
- uat has signed off the commit `dev-x.y-tested` is on. Note it for the commit field.

**Switch** (Settings › Secrets and variables › Actions)

1. Delete the variable `PUBLIC_IMAGE`. From then on the buttons publish to
   `docker.io/sebadmin/seb-server-gui` and log in with `DOCKERHUB_ADMIN_*`.
2. Delete the secrets `REHEARSAL_REGISTRY_USERNAME` and `REHEARSAL_REGISTRY_TOKEN`.
3. Delete the rehearsal git tags (their messages name the rehearsal account):
   ```sh
   git push origin --delete $(git ls-remote --tags --refs origin 'refs/tags/rehearsal/*' | cut -f2)
   ```
4. On the Docker Hub account the rehearsal used: revoke its access token (app.docker.com ›
   Account settings › Personal access tokens) and delete the rehearsal repository.

**First real release**

5. Release stable on `dev-x.y` as a dry run. The summary must have no "Rehearsal" line, take the
   next real version (for 3.0: `v3.0.3`) and show the git tags without the `rehearsal/` prefix.
   The image shows as `docker.io/***/seb-server-gui` (see "Rehearsal").
6. The same without dry run, with the commit uat signed off.
7. Check the summary: `vX.Y.Z`, `vX.Y-stable` and `vX.Y-latest` are the new version; the git
   tags `vX.Y.Z` and `vX.Y-stable` are on the commit. On hub.docker.com, `sebadmin/seb-server-gui`
   › Tags shows the three names with the same digest.
8. A PR `dev-x.y` → `main` as the archive (merge commit).
9. Then the legacy cleanup below.

## Scripts

| File                       | Does                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `scripts/images.sh`        | The image names, in one place (sourced by the workflows and scripts)                   |
| `scripts/nightly-e2e.sh`   | The nightly e2e, per line: pin, skip, test, report, move `-tested`                     |
| `scripts/release.sh`       | The release buttons: pin, version, publish, git tags                                   |
| `scripts/ghcr-cleanup.sh`  | Deletes old untagged ghcr versions, keeps the newest 20; tagged ones are never touched |
| `scripts/e2e-on-server.sh` | **Placeholder**: deploy one image to the e2e server and run the full suite against it  |

## Placeholders

These wait for the servers. Each has one switch, so nothing else needs to change.

| What                                                                  | Needs                                                                                  | Switch                          |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------- |
| `scripts/e2e-on-server.sh`                                            | how a job deploys an exact image to the e2e server and resets its data; the full suite | repo variable `E2E_MODE=server` |
| Where the nightly e2e runs                                            | GitHub-hosted if the e2e server is reachable, else our own runner inside ETH           | `runs-on` in `nightly-e2e.yml`  |
| Servers: dev on `development`, uat on `-tested`, pull secret for ghcr | Rancher setup (sysadmins)                                                              | nothing in this repo            |

Until `E2E_MODE=server`, the nightly e2e starts the image inside the GitHub runner and runs the
mocked suite against it (commit status `e2e/image`). With the server it runs the full suite
(commit status `e2e/full`).

## Legacy: what gets deleted, and when

Kept until the first release has gone through the Release stable button. Then:

1. Tell whoever maintains `seb-server-setup`: it references the Docker Hub names `demo` and
   `sprint-testing`, which nothing updates any more after this.
2. Delete `workflows/legacy-tag-build.yml`, `workflows/legacy-auto-testing-deploy.yml` and
   `legacy/`, on `development` and every `dev-x.y`.
3. Add a tag ruleset to `rulesets/`: version tags `vX.Y.Z` can't be moved or deleted
   (`vX.Y-stable` still moves).
4. Delete the unused secret `DOCKERHUB_PASSWORD`.
5. Delete the git tag `vX.Y-latest` (`v3.0-latest`): nothing moves it any more. The Docker Hub
   name `vX.Y-latest` stays; the buttons move it.
6. Update this file.

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
