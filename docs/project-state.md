# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** P0 largely complete → next **P1** (usage provider + mock)

## Completed

| Area | Status |
|------|--------|
| Plugin UUID / package rename | `com.local.cursor-usage` |
| Docker build / watch | Working (`STREAMDECK_RESTART=0`) |
| Manifest + Show Usage action | Present |
| Key title format helper | `formatTitle` in `show-usage.ts` |
| PI refresh slider | Present; **not** wired to a timer |
| `fetchUsage` | Stub returning null (`—%` / `—d`) |
| Docs: README, AGENTS, CLAUDE | Present |
| Git remotes | `origin` = product repo; `upstream` = boilerplate |

## Not started

- `src/usage/` provider interface / mock / real
- Auto-refresh timer from `refreshSeconds`
- Real Cursor data source
- Error title tokens / resilience (P4)
- Automated tests / Marketplace pack

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Runtime target | Stream Deck Nodejs 20 in manifest |
| Install | Documented copy into Plugins |

## Quick verify

```powershell
docker compose run --rm build
# then copy com.local.cursor-usage.sdPlugin into Stream Deck Plugins and restart
```

Expect key title `—%` / `—d` until P1+.

## Changelog

- **2026-11-03** — Initial state after scaffold specialize; P0 shell
