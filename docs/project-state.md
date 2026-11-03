# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **P2 complete** → next **P3** (real Cursor usage source)

## Completed

| Area | Status |
|------|--------|
| Plugin UUID / package rename | `com.local.cursor-usage` |
| Docker build / watch | Working (`STREAMDECK_RESTART=0`) |
| Manifest + Show Usage action | Present |
| `src/usage/` | `UsageProvider`, `MockUsageProvider`, `formatTitle` |
| Default provider | `MockUsageProvider` → `42%` / `12d` |
| Auto-refresh timer | `refreshSeconds` 30–600 (default 120); clear on disappear |
| Docs: README, AGENTS, CLAUDE | Present |
| Git remotes | `origin` = product repo; `upstream` = boilerplate |
| Install | Copied to Stream Deck Plugins |

## Not started

- Real Cursor data source (P3) — **decide data source first**
- Error title tokens / resilience (P4)
- Automated tests / Marketplace pack

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Runtime target | Stream Deck Nodejs 20 in manifest |
| Install | Copy into Plugins (not junction) |

## Quick verify (P2)

```powershell
docker compose run --rm build
# robocopy/copy into Plugins, restart Stream Deck
# key shows 42%/12d; change refresh in PI → title updates on interval without tap
```

## Changelog

- **2026-11-03** — P2 complete: per-key interval from `refreshSeconds`, cleared on disappear
- **2026-11-03** — P1 complete: `UsageProvider` + mock (42%/12d)
- **2026-11-03** — P0 complete: build + copy install
