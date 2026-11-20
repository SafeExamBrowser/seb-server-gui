# Legacy: the old tag-driven image builds

Everything here is the **old** way images get built: push a git tag, and CI rebuilds
from source and pushes to Docker Hub. It keeps working exactly as before until the new
pipeline (build on merge, release by promotion) is complete. Then it gets deleted.

Anything legacy is easy to spot:

- workflow files start with `legacy-` (`.github/workflows/legacy-*.yml`)
- workflow names start with `Legacy ·` in the Actions tab
- helper scripts live in this folder

## What a tag push does

| You push the git tag                                    | Workflow that runs               | Result on Docker Hub                                                                               |
| ------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| any tag, e.g. `sprint-testing`, `v3.0.1`, `v3.0-latest` | `legacy-tag-build.yml`           | `sebadmin/seb-server-gui:<tag>`, rebuilt from the tagged commit                                    |
| `auto-testing-deploy`                                   | `legacy-auto-testing-deploy.yml` | `sebadmin/seb-server-gui-auto-testing:auto-testing-deploy` and `…:auto-testing-deploy-single-host` |
|                                                         | **and** `legacy-tag-build.yml`   | `sebadmin/seb-server-gui:auto-testing-deploy`                                                      |

A tag runs the workflow files **at the tagged commit**. A tag on a commit from before
this folder existed runs the old file names (`docker-build-push.yml`,
`auto-test-deploy.yml`); the result is the same.

## Refreshing `sprint-testing`

```bash
.github/legacy/deploy-auto-testing.sh
```

Moves the `sprint-testing` tag to your current commit (delete, re-create, force the
remote) so `legacy-tag-build.yml` rebuilds `sebadmin/seb-server-gui:sprint-testing`.
This used to be `github/deploy-auto-testing.sh`.

## When this goes away

After the first release through the new Release stable button. The delete list is in
[`../PIPELINE.md`](../PIPELINE.md#legacy-what-gets-deleted-and-when).

Until then `legacy-tag-build.yml` reacts to **every** tag pushed by a person. The new
release buttons push their tags with `GITHUB_TOKEN`, which doesn't start other
workflows, so the two never both react to the same tag. Once the buttons exist, don't
push release tags by hand: it would rebuild and overwrite the released image.
