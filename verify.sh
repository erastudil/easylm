#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Running EasyLM deterministic verification..."
node scripts/verify.mjs

echo "==> All EasyLM verification checks passed green!"
