# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **P3 complete** → next **P4** (error / empty states)

## Completed

| Area | Status |
|------|--------|
| Plugin UUID / package rename | `com.local.cursor-usage` |
| Docker build / watch | Working (`STREAMDECK_RESTART=0`) |
| Manifest + Show Usage action | Present |
| `src/usage/` | mock + `CursorCloudUsageProvider` + `resolveProvider` |
| Credential | PI `accessToken` only (no profile / `state.vscdb` reads) |
| Live API | `GetCurrentPeriodUsage` + `usage-summary` fallback |
| Auto-refresh timer | `refreshSeconds` 30–600 (default 120) |
| Mock fallback | No token or `useMock` → 42% / 12d |
| Docs | README credential setup |

## Not started

- Error title tokens / resilience polish (P4) — fetch failures currently show `—%` / `—d`
- Automated tests / Marketplace pack

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Runtime target | Stream Deck Nodejs 20 in manifest |
| Install | Copy into Plugins (not junction) |
| Live data | Cursor HTTPS; credential in Stream Deck settings |

## Quick verify (P3)

```powershell
docker compose run --rm build
# copy into Plugins, restart Stream Deck
# no token → 42%/12d; paste credential → live % and days; tap refreshes
```

## Changelog

- **2026-11-03** — P3 complete: PI credential → Cursor cloud usage; mock fallback; no profile reads
- **2026-11-03** — P2 complete: per-key interval from `refreshSeconds`
- **2026-11-03** — P1 complete: `UsageProvider` + mock
- **2026-11-03** — P0 complete: build + copy install
