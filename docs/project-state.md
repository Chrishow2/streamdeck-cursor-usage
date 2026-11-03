# Cursor Usage — Project State

Living snapshot of what exists in the repo now.

**Last updated:** 2026-11-03  
**Current phase:** **P0 complete** → next **P1** (usage provider + mock)

## Completed

| Area | Status |
|------|--------|
| Plugin UUID / package rename | `com.local.cursor-usage` |
| Docker build / watch | Working (`STREAMDECK_RESTART=0`) |
| Manifest + Show Usage action | Present |
| Key title format helper | `formatTitle` → `—%` / `—d` when unknown |
| PI refresh slider | Present; **not** wired to a timer (P2) |
| `fetchUsage` | Stub returning null (P1 replaces with provider) |
| Docs: README, AGENTS, CLAUDE | Present |
| Git remotes | `origin` = product repo; `upstream` = boilerplate |
| P0 install | Copied to `%AppData%\Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin` |

## Not started

- `src/usage/` provider interface / mock / real (P1+)
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

## Quick verify (P0)

```powershell
docker compose run --rm build
# plugin already copied; restart Stream Deck, then:
# drag Show Usage onto a key → expect —% / —d; open PI
```

## Changelog

- **2026-11-03** — P0 complete: build verified, plugin copied to Stream Deck Plugins, boilerplate junction removed
- **2026-11-03** — Initial state after scaffold specialize; P0 shell
