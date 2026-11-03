# Cursor Usage (Stream Deck)

Docker-first Stream Deck plugin for **Cursor usage %** and **days until reset**. Host Node.js is not required.

## Pre-built release

On each version tag (`v*`), GitHub Actions builds the plugin and attaches `com.local.cursor-usage.streamDeckPlugin` to the [Releases](../../releases) page.

1. Download the `.streamDeckPlugin` asset from the latest release.
2. Double-click it (or open with Stream Deck) to install.
3. Restart Stream Deck if the actions do not appear yet.

To cut a release after pushing `main`: create and push a tag such as `v0.2.0` (match `package.json` / `manifest.json` when you can).

## Quick start (build from source)

Requires Docker and Stream Deck **7.1+**.

```powershell
cd cursor-usage
docker compose run --rm build

$src = Join-Path $PWD "com.local.cursor-usage.sdPlugin"
$dest = Join-Path $env:APPDATA "Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin"
robocopy $src $dest /E /IS /IT
```

Restart Stream Deck. Under **Cursor Usage**, drag any of:

| Action | Mock look (no credential) |
| --- | --- |
| **Usage %** | Cyan ring gauge + `42` + `CURSOR` (dynamic art) |
| **Days Until Reset** | Large `12d` + `RESET` (dynamic art) |
| **Overview** | Title text `42%` / `12d` (unchanged) |

Then:

1. Select the key → open the property inspector.
2. Optional: paste a **Cursor credential** (see below); leave **Force mock data** unchecked for live data.
3. Tap the key to refresh; adjust **Refresh (seconds)** as needed (30–600).

| State | Usage % | Days |
| --- | --- | --- |
| Mock / no token | `42%` | `12d` |
| Live OK | e.g. `53%` | e.g. `9d` |
| Fetch error | `ERR` | `?d` |

Credentials are **per key**. Paste on each action instance you use.

## Configure Cursor credential

The plugin does **not** read your Cursor IDE profile or `state.vscdb`. Paste into Stream Deck settings only.

**Option A — access token** (preferred for `api2.cursor.sh`)

1. Use a Cursor access token from your own login/session (e.g. agent/CLI login token).
2. Paste into **Cursor credential**.
3. Leave **Force mock data** unchecked.

**Option B — dashboard session cookie**

1. Sign in at [cursor.com](https://cursor.com) → DevTools → Application → Cookies.
2. Copy `WorkosCursorSessionToken` (value alone, or `WorkosCursorSessionToken=...`).
3. Paste into **Cursor credential**.

Traffic goes only to Cursor (`api2.cursor.sh`, fallback `cursor.com`). Never commit tokens. The plugin does not log the credential.

Unofficial usage endpoints may change when Cursor updates.

## Develop

```powershell
docker compose run --rm build
docker compose run --rm watch
```

After each rebuild, `robocopy` (or equivalent) into Plugins again and restart Stream Deck. Watch sets `STREAMDECK_RESTART=0` (no host Stream Deck CLI).

`*.sdPlugin/bin` is gitignored — always build before testing.

## Verify checklist

- [ ] `docker compose run --rm build` succeeds
- [ ] Plugin folder copied to `%AppData%\Elgato\StreamDeck\Plugins\com.local.cursor-usage.sdPlugin`
- [ ] Stream Deck restarted; **Usage %** / **Days Until Reset** / **Overview** appear
- [ ] No credential → mock titles; bad credential → `ERR` / `?d`; tap retries
- [ ] Valid credential → live % and days (optional)

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
