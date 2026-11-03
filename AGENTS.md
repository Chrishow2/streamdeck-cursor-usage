# AGENTS.md

Coding-agent notes for the **Cursor Usage** Stream Deck plugin. Human install: [README.md](README.md).

## Product

Show Cursor usage percent and/or days until quota/billing reset. Plugin UUID: `com.local.cursor-usage`.

Actions: `percent`, `days`, `show` (Overview).

## Layout

| Path | Role |
| --- | --- |
| `src/` | TypeScript entry + actions |
| `src/usage/` | Providers (`mock`, `cursor-cloud`), `resolveProvider`, format helpers |
| `src/actions/usage-key-action.ts` | Shared fetch/timer/settings |
| `src/actions/show-*.ts` | Usage %, Days, Overview |
| `com.local.cursor-usage.sdPlugin/` | Packaged plugin (`manifest.json`, `ui/`, `imgs/`) |
| `com.local.cursor-usage.sdPlugin/bin/` | **Generated** — do not hand-edit |
| `rolldown.config.ts` | Bundle path; `sdPlugin` must match UUID |

Keep UUID, `.sdPlugin` folder name, `package.json` `name`, and rolldown `sdPlugin` in sync.

## Commands

```powershell
docker compose run --rm build
docker compose run --rm watch
```

Install (after build):

```powershell
robocopy ".\com.local.cursor-usage.sdPlugin" "$env:APPDATA\Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin" /E /IS /IT
```

- **Test / lint / typecheck:** none configured
- **Before commit:** `docker compose run --rm build` must succeed

Compose sets `STREAMDECK_RESTART=0` — restart Stream Deck on the host after rebuilds.

## Conventions

- Action UUID in `@action` must match `manifest.json`
- Usage fetch lives in `UsageProvider` implementations; actions only refresh + format titles
- Live usage: PI `accessToken` → HTTPS to Cursor only; **never** read `%AppData%\Cursor` / `state.vscdb`
- Prefer Docker; do not require host Node or `.ps1` scripts

## Gotchas

- Empty token or `useMock` → mock `42%` / `12d`
- Auto-refresh clamps `refreshSeconds` to 30–600 (default 120); timers clear on will-disappear
- Never log `accessToken` / session cookies
- Fetch failures: `%` → `ERR`, days → `?d`, overview → `ERR`/`?d`; tap retries
- Settings (including credential) are **per key instance**
- Named volume `cursor_usage_node_modules` caches deps; refresh if installs look stale
- `*.sdPlugin/bin` is gitignored — build before testing in Stream Deck

## Boundaries

- Do not hand-edit `bin/plugin.js`
- Do not change the sibling `boilerplate/` template from this project
- Do not add local IDE profile scrapers without an explicit product decision
- No Marketplace packaging unless explicitly requested
