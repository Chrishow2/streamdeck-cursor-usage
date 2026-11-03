# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **F1 complete** — dynamic key art on Usage % + Days

## Completed

| Area | Status |
|------|--------|
| P0–P5 | MVP complete |
| F1 key art | Pure-JS PNG ring/% + days/`RESET` via `setImage` |
| Actions | **Usage %** + **Days** use art; **Overview** title-only |
| Version | package `0.2.0` / manifest `0.2.0.0` |
| Credential UX | Per-action token (global share deferred) |

## Not started / future

- Marketplace pack (F2)
- Richer metrics (F3)
- Multi-profile (F4)
- Automated tests
- Shared/global credential (deferred)

## Stack (as implemented)

| Area | Choice |
|------|--------|
| SDK | `@elgato/streamdeck` ^3.0.4 |
| Build | Docker `node:24-bookworm` + rolldown |
| Install | `robocopy` into Plugins |
| Key art | `src/usage/key-art/` (zlib PNG, no native deps) |

## Quick verify (F1)

```powershell
docker compose run --rm build
robocopy ".\com.local.cursor-usage.sdPlugin" "$env:APPDATA\Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin" /E /IS /IT
# restart Stream Deck
# Usage % → cyan ring + number; Days → 12d + RESET; Overview unchanged
```

## Changelog

- **2026-11-03** — F1 complete: dynamic key art for Usage % and Days Until Reset
- **2026-11-03** — Plan F1 added; P5–P0 MVP
