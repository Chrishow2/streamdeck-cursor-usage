# Stream Deck plugin boilerplate

Docker-first starter for a local Elgato Stream Deck plugin. Copy or clone this folder to begin a real plugin; keep this template generic.

## Quick start

Requires Docker and Stream Deck **7.1+** on Windows 10+ (or macOS 12+). Host Node.js is **not** required.

```powershell
cd boilerplate
docker compose run --rm build
```

Link the plugin into Stream Deck (CMD, adjust the source path):

```cmd
mklink /J "%AppData%\Elgato\StreamDeck\Plugins\com.local.boilerplate.sdPlugin" "%CD%\com.local.boilerplate.sdPlugin"
```

Restart the Stream Deck app, then drag **Increment Counter** onto a key.

- Tap: increment
- Long-press (~1.5s): reset to 0

## Usage

### Build once

```powershell
docker compose run --rm build
```

Writes `com.local.boilerplate.sdPlugin/bin/plugin.js`.

### Watch (rebuild on save)

```powershell
docker compose run --rm watch
```

After each rebuild, restart Stream Deck (or the plugin) on the host so changes load. Automatic `streamdeck restart` is disabled in Docker (`STREAMDECK_RESTART=0`).

### Link / unlink (Windows)

From this folder in **CMD**:

```cmd
mklink /J "%AppData%\Elgato\StreamDeck\Plugins\com.local.boilerplate.sdPlugin" "%CD%\com.local.boilerplate.sdPlugin"
```

Unlink (removes the junction only, not the project files):

```cmd
rmdir "%AppData%\Elgato\StreamDeck\Plugins\com.local.boilerplate.sdPlugin"
```

On macOS, symlink into `~/Library/Application Support/com.elgato.StreamDeck/Plugins/` instead.

### Start a real plugin from this template

1. Copy or clone this folder into a new project.
2. Rename the plugin UUID and folder (`com.local.boilerplate` → your reverse-DNS id).
3. Update `package.json`, `rolldown.config.ts`, `manifest.json`, and action UUIDs.
4. Implement your actions under `src/`.

## Requirements

| Piece | Notes |
| --- | --- |
| Docker | Builds and watches via `docker compose` |
| Stream Deck | App **7.1+**, with a device |
| OS | Windows 10+ or macOS 12+ (per `manifest.json`) |
| Node on host | Optional; not needed for the Docker workflow |

Sample plugin runtime uses Stream Deck’s embedded Node (`Nodejs.Version` **20** in the manifest). SDK: `@elgato/streamdeck` ^3.

## Docs

- [Stream Deck SDK – Getting started](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started)
- [Manifest reference](https://docs.elgato.com/streamdeck/sdk/references/manifest)

## Contributing

This folder is a **plugin-agnostic template**. Prefer changes that help every new plugin, not one product. Agent notes: [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md).

## License

<!-- TODO: add a LICENSE file and name the license here -->
Not specified yet.
