# Rulesets

A reviewable copy of the repository rulesets. **GitHub never reads this folder.** After changing
a file here, apply it by hand:

```sh
R=SafeExamBrowser/seb-server-gui
gh api repos/$R/rulesets -q '.[] | "\(.id) \(.name) \(.enforcement)"'   # ids
gh api -X PUT  repos/$R/rulesets/<id> --input .github/rulesets/<file>.json # update
gh api -X POST repos/$R/rulesets      --input .github/rulesets/<file>.json # create
```

| File                 | Branches                      | Required checks                      | Merge methods        |
| -------------------- | ----------------------------- | ------------------------------------ | -------------------- |
| `development.json`   | `development`                 | `client`, `server`                   | squash, merge commit |
| `release-lines.json` | `dev-[0-9]*` (e.g. `dev-3.0`) | `client`, `server`, `allowed-source` | squash               |
| `main.json`          | `main`                        | `allowed-source`                     | merge commit         |

All three: PR required, no force push, no deletion, conversations resolved, empty bypass list.

Why some settings are the way they are:

- **0 required approvals** while only one dev is active (nobody can approve their own PR).
  Raise to 1 in `development.json` when the team is back.
- **`strict_required_status_checks_policy: false`** ("branch must be up to date") everywhere.
  With it on, a back-merge `dev-3.0` → `development` would first need `development` merged
  into `dev-3.0`, and a release merge `dev-3.0` → `main` would need `main` merged into
  `dev-3.0`.
- **`dev-[0-9]*`, never `dev-*`**: `dev-*` would also match a branch called `dev-e2e-tests`.
- **`do_not_enforce_on_create: true`** on release lines, so a new `dev-3.1` can be pushed
  before any check has run on it.
- **The release-lines deletion rule** also protects `dev-3.0` when a `dev-3.0` → `main` PR is
  merged ("Automatically delete head branches" is on).
- Status checks from GitHub Actions need `"integration_id": 15368`. The check names are the
  job names in `.github/workflows/pr.yml` and `allowed-source.yml`.
- **Never enable "Require review from Code Owners"**: `.github/CODEOWNERS` only has placeholder
  handles.
