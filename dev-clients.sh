#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PIDS=()

start_app() {
  local name="$1"
  local dir="$2"
  local port="$3"

  echo ""
  echo "Starting ${name} on port ${port}..."
  (
    cd "${ROOT_DIR}/${dir}"
    if [ "${name}" = "web-marketing" ]; then
      npm run dev -- --port "${port}"
    else
      npm run dev -- -p "${port}"
    fi
  ) &

  PIDS+=("$!")
}

cleanup() {
  echo ""
  echo "Stopping client development servers..."

  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done

  wait || true
}

trap cleanup EXIT INT TERM

echo "Launching client development servers from ${ROOT_DIR}"

start_app "web-builder" "apps/web-builder" "3000"
start_app "web-sites" "apps/web-sites" "3001"
start_app "web-marketing" "apps/web-marketing" "4321"

echo ""
echo "All three dev servers are starting."
echo "Press Ctrl+C to stop them together."

wait
