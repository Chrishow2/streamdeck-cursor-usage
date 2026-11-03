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
Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
Copy-Item -Recurse $src $dest
```

Restart Stream Deck, then drag **Show Usage** onto a key. Tap to refresh. Until a data source is wired, the key shows `—%` / `—d`.

## Usage

```powershell
docker compose run --rm build
docker compose run --rm watch
```

After rebuilds, re-copy into Plugins (or overwrite in place) and restart Stream Deck. Watch disables `streamdeck restart` (`STREAMDECK_RESTART=0`).

## Requirements

| Piece | Notes |
| --- | --- |
| Docker | Build / watch via `docker compose` |
| Stream Deck | App **7.1+**, with a device |
| Node on host | Optional |

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
