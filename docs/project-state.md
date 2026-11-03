# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **P4 complete** → next **P5** (polish / ship notes)

## Completed

| Area | Status |
|------|--------|
| Plugin UUID / package rename | `com.local.cursor-usage` |
| Actions | **Usage %**, **Days Until Reset**, **Overview** |
| Shared key logic | `UsageKeyAction` + format helpers |
| Credential | PI `accessToken` only (no profile reads) |
| Live API | Connect RPC + usage-summary fallback |
| Auto-refresh | `refreshSeconds` 30–600 |
| Mock fallback | No token or `useMock` → 42% / 12d |
| Errors (P4) | `ERR` / `?d` / overview `ERR\n?d`; safe logs; tap retries |

## Not started

- P5 polish (docs/icons accuracy pass)
- Automated tests / Marketplace pack

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Install | Copy into Plugins |
| Live data | Cursor HTTPS; credential in Stream Deck settings |

## Quick verify (P4)

```powershell
docker compose run --rm build
# copy, restart Stream Deck
# paste bad token → ERR / ?d; tap retries; fix token → live values
```

## Changelog

- **2026-11-03** — P4 complete: `UsageFetchError` codes; `ERR`/`?d` titles; no secret logs
- **2026-11-03** — Separate Usage % / Days Until Reset actions; Overview kept
- **2026-11-03** — P3 complete: PI credential → Cursor cloud
- **2026-11-03** — P2 / P1 / P0 complete
