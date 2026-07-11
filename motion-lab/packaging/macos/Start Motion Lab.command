#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
export HOSTNAME=127.0.0.1
export PORT=3210
export PATH="$ROOT/runtime/node/bin:$PATH"
(sleep 2 && open "http://localhost:3210") &
exec "$ROOT/runtime/node/bin/node" "$ROOT/server.js"
