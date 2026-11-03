# Cursor Usage (Stream Deck)

Local Stream Deck plugin that shows **Cursor usage** and **days until reset** on a key. Docker-first; host Node.js is not required.

## Quick start

Requires Docker and Stream Deck **7.1+**.

```powershell
cd cursor-usage
docker compose run --rm build
```

Copy the built plugin into Stream Deck (PowerShell):

```powershell
$src = Join-Path $PWD "com.local.cursor-usage.sdPlugin"
$dest = Join-Path $env:APPDATA "Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin"
robocopy $src $dest /E /IS /IT
```

Restart Stream Deck, then drag **Show Usage** onto a key.

- **No credential:** mock `42%` / `12d`
- **With credential:** live usage from Cursor over HTTPS
- Tap to refresh; property inspector sets refresh interval

## Configure Cursor credential (recommended)

The plugin does **not** read your Cursor IDE profile or `state.vscdb`. Paste a credential into the key’s property inspector (stored in Stream Deck settings only).

**Option A — access token (preferred for `api2.cursor.sh`)**

1. Use a Cursor access token from your own login/session (e.g. agent/CLI login token).
2. Paste it into **Cursor credential** on the key.
3. Leave **Force mock data** unchecked.

**Option B — dashboard session cookie**

1. Sign in at [cursor.com](https://cursor.com) → DevTools → Application → Cookies.
2. Copy `WorkosCursorSessionToken` (value alone, or `WorkosCursorSessionToken=...`).
3. Paste into **Cursor credential**.

Traffic goes only to Cursor (`api2.cursor.sh` and, as fallback, `cursor.com`). Never commit tokens. The plugin does not log the credential.

Unofficial usage endpoints may change when Cursor updates.

## Usage

```powershell
docker compose run --rm build
docker compose run --rm watch
```

After rebuilds, re-copy into Plugins and restart Stream Deck. Watch disables `streamdeck restart` (`STREAMDECK_RESTART=0`).

## Requirements

| Piece | Notes |
| --- | --- |
| Docker | Build / watch via `docker compose` |
| Stream Deck | App **7.1+**, with a device |
| Node on host | Optional |
| Network | Required for live Cursor usage |

SDK: `@elgato/streamdeck` ^3. Plugin UUID: `com.local.cursor-usage`.

## Docs

- [Project state](docs/project-state.md)
- [Stream Deck SDK – Getting started](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started)
- [Manifest reference](https://docs.elgato.com/streamdeck/sdk/references/manifest)

## Contributing

Agent notes: [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md).

## License

<!-- TODO: add a LICENSE file and name the license here -->
Not specified yet.
