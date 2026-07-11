#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
export PATH="$ROOT/runtime/node/bin:$PATH"
if [[ ! -f ".agent-dev-ready" ]]; then
  echo "Installing locked development dependencies for the first time..."
  "$ROOT/runtime/node/bin/npm" ci
  touch ".agent-dev-ready"
fi
exec "$ROOT/runtime/node/bin/npm" run dev
