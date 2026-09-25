#!/usr/bin/env bash
# Long-running Vite dev server for the ROI calculators (gorgias-website-apps).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP="$(cd "$HERE/.." && pwd)/gorgias-website-apps"

if [ ! -d "$APP" ]; then
  echo "gorgias-website-apps is not checked out in this workspace; nothing to serve."
  exec sleep infinity
fi

cd "$APP"
echo "Starting Vite dev server at http://127.0.0.1:5173/"
exec npm run dev -- --host 127.0.0.1 --port 5173
