#!/usr/bin/env bash
# PLACEHOLDER: the e2e server isn't set up yet. See .github/PIPELINE.md, "Placeholders".
#
# Will deploy exactly one image (by digest) to the e2e server, reset its data and run the full
# (real-backend) e2e suite against it. The nightly e2e calls it when the repo variable E2E_MODE
# is "server"; until then the nightly tests the image inside the GitHub runner instead.
#
# Usage: e2e-on-server.sh <image>@sha256:<digest>
#
# Still to find out before it can be written:
# - how a job deploys an exact digest to the e2e server on Rancher, and resets the data
# - whether GitHub can reach the server, or the job needs our own runner inside ETH
#   (a self-hosted runner must never take pull-request workflows: public repo, fork PRs)
# - the full suite's own Playwright config and test login (being written on nadim-tests)
set -euo pipefail

echo "::error::e2e-on-server.sh is a placeholder: the e2e server isn't set up yet." \
  "Remove the repo variable E2E_MODE to test inside the runner." >&2
exit 1
