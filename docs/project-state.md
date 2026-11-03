# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **P5 complete** — MVP slice (P0–P5) done

## Completed

| Area | Status |
|------|--------|
| P0–P4 | Shell, mock provider, auto-refresh, cloud credential, errors |
| Actions | **Usage %**, **Days Until Reset**, **Overview** |
| Docs polish (P5) | README verify checklist + AGENTS install path aligned |
| Version | package `0.1.2` / manifest `0.1.2.0` |
| Icons | Stock counter-style assets kept (optional refresh deferred) |

## Not started / future

- Marketplace pack (F1)
- Richer metrics / threshold images (F2)
- Multi-profile (F3)
- Automated tests
- Custom key art (optional)

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Install | `robocopy` into Plugins |
| Live data | Cursor HTTPS; PI credential; no profile reads |

## Quick verify (P5)

See README **Verify checklist**.

```powershell
docker compose run --rm build
robocopy ".\com.local.cursor-usage.sdPlugin" "$env:APPDATA\Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin" /E /IS /IT
# restart Stream Deck → mock titles without credential
```

## Changelog

- **2026-11-03** — P5 complete: README/AGENTS polish, version bump, MVP closed
- **2026-11-03** — P4 complete: `ERR`/`?d` titles
- **2026-11-03** — Separate % / days actions; P3 cloud credential; P2–P0
