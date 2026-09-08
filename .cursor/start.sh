#!/usr/bin/env bash
# Per-boot startup for the dashboard-managed (db) environment: launch both dev
# servers and stay attached so the platform keeps a combined log.
#
# The repo-file environment.json expresses these as two named `terminals`
# instead (nicer per-server logs). This script exists so the same setup can be
# saved as a db-managed environment, where only `install` and `start` are
# available. Both paths call the same serve-*.sh helpers.
set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[start] launching dev servers (vite:5173, static:5500)…"
bash "$DIR/serve-apps.sh" &
apps_pid=$!
bash "$DIR/serve-webflow.sh" &
web_pid=$!
echo "[start] serve-apps pid=$apps_pid  serve-webflow pid=$web_pid"

# Stay attached to both long-running servers.
wait
