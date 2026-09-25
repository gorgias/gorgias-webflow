#!/usr/bin/env bash
# Static file server for the gorgias-webflow custom code.
#
# gorgias.com is built in Webflow; this repo holds the custom JS/CSS served via
# CDN in production. For local development you point gorgias.com at these files
# by appending ?debug=gorgias to the URL (see README) — this server plays the
# role of the VS Code "Live Server" the README describes.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

echo "Serving gorgias-webflow at http://127.0.0.1:5500/ (e.g. http://127.0.0.1:5500/src/main.js)"
exec python3 -m http.server 5500 --bind 127.0.0.1
