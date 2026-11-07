#!/usr/bin/env bash
# Idempotent dependency bootstrap for the Gorgias website workspace.
#
# This repo (gorgias-webflow) is the primary repo and is pure static custom
# code with no dependencies of its own — its tests use Node's built-in runner.
# The sibling repos are set up opportunistically: each step is guarded so the
# script also succeeds when only gorgias-webflow is checked out.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # gorgias-webflow root
REPOS_ROOT="$(cd "$HERE/.." && pwd)"                       # workspace root (siblings live here)

echo "node: $(node -v)   npm: $(npm -v)"

install_repo() {
  local dir="$1"
  if [ ! -f "$dir/package.json" ]; then
    echo "skip: ${dir#$REPOS_ROOT/} (not checked out)"
    return 0
  fi
  echo "== npm install: ${dir#$REPOS_ROOT/} =="
  if [ -f "$dir/package-lock.json" ]; then
    (cd "$dir" && npm ci)
  else
    (cd "$dir" && npm install)
  fi
}

# React ROI calculators (Vite) — runnable dev server + build.
install_repo "$REPOS_ROOT/gorgias-website-apps"

# Webflow code-component library — `npm run type-check` is the offline CI gate
# (`npm run dev`/`share` require Webflow authentication).
install_repo "$REPOS_ROOT/gorgias-website-components"

# Note: gorgias-web (the legacy Web Messenger) is intentionally not installed
# here — its dependency tree references an upstream git repo that no longer
# exists (ev1stensberg/generator), so `npm install` cannot resolve.

echo "install complete"
