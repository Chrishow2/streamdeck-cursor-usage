# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **P1 complete** → next **P2** (auto-refresh from PI)

## Completed

| Area | Status |
|------|--------|
| Plugin UUID / package rename | `com.local.cursor-usage` |
| Docker build / watch | Working (`STREAMDECK_RESTART=0`) |
| Manifest + Show Usage action | Present |
| `src/usage/` | `UsageProvider`, `MockUsageProvider`, `formatTitle` |
| Default provider | `MockUsageProvider` → `42%` / `12d` |
| PI refresh slider | Present; **not** wired to a timer (P2) |
| Docs: README, AGENTS, CLAUDE | Present |
| Git remotes | `origin` = product repo; `upstream` = boilerplate |
| Install | Copied to Stream Deck Plugins |

## Not started

- Auto-refresh timer from `refreshSeconds` (P2)
- Real Cursor data source (P3)
- Error title tokens / resilience (P4)
- Automated tests / Marketplace pack

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Runtime target | Stream Deck Nodejs 20 in manifest |
| Install | Copy into Plugins (not junction) |

## Quick verify (P1)

```powershell
docker compose run --rm build
# copy into Plugins, restart Stream Deck
# Show Usage key → expect 42% / 12d; tap refreshes
```

## Changelog

- **2026-11-03** — P1 complete: `UsageProvider` + mock (42%/12d); action uses provider
- **2026-11-03** — P0 complete: build verified, plugin copied to Stream Deck Plugins
- **2026-11-03** — Initial state after scaffold specialize
