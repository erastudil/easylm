---
title: "scripts — dir law"
summary: "build + audit tooling. zero-dep. truthful exit codes."
last_updated: "2026-09-18"
status: living · easylm
---

# scripts

build and audit tooling. node stdlib only — no new deps for a script that a cron job runs. CLI output per `docs/POLICIES.md` §3: one line per event, exit 0 clean / 1 regression / 2 config error, last line says pass or fail. `scripts/_*` files are private helpers.