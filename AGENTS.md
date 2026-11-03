# AGENTS.md

Coding-agent notes for this Stream Deck plugin **template**. Human install steps: [README.md](README.md).

## Template rule (committed source of truth)

This directory is a **starter template**, not a product plugin.

- Keep sample code minimal; keep placeholder UUID/name (`com.local.boilerplate`)
- Do not add product-specific actions, APIs, or branding here
- When building a real plugin: clone/copy first, then rename UUID / `.sdPlugin` / package metadata there

## Layout

| Path | Role |
| --- | --- |
| `src/` | TypeScript plugin entry + actions (bundled) |
| `com.local.boilerplate.sdPlugin/` | Packaged plugin Stream Deck loads (`manifest.json`, `ui/`, `imgs/`) |
| `com.local.boilerplate.sdPlugin/bin/` | **Generated** — do not hand-edit (`plugin.js`) |
| `rolldown.config.ts` | Bundle output path + UUID string (`com.local.boilerplate`) |
| `Dockerfile` / `docker-compose.yml` | Zero-host-Node build/watch |

UUID, `.sdPlugin` folder name, `package.json` `name`, and `rolldown.config.ts` `sdPlugin` must stay in sync.

## Commands

No host Node assumed. From this directory:

```powershell
docker compose run --rm build
docker compose run --rm watch
```

- **Install / run:** none beyond Docker build + install into Stream Deck Plugins (see README.md)
- **Test / lint / typecheck:** none configured
- **Before commit:** `docker compose run --rm build` must succeed; do not commit `node_modules/` or `*.sdPlugin/logs`

Compose sets `STREAMDECK_RESTART=0` — watch will not call the Stream Deck CLI; restart the app/plugin on the host after rebuilds.

## Conventions

- Keep sample action minimal (`IncrementCounter`); no product APIs here
- Action UUID in `@action({ UUID })` must match `manifest.json` `Actions[].UUID`
- Prefer Docker workflow; do not add host-Node or `.ps1` requirements to the template

## Gotchas

- Stream Deck runs the plugin from `%AppData%\Elgato\StreamDeck\Plugins\` (Windows), not from this repo, until you junction or **copy** the built `.sdPlugin` folder there
- Renaming the plugin requires updating UUID + folder + rolldown `sdPlugin` + link/copy destination together
- Named Docker volume `boilerplate_node_modules` caches `node_modules`; after dependency changes, rebuild image or refresh that volume if installs look stale
- `*.sdPlugin/bin` is gitignored — CI/clones need a build before testing in Stream Deck

## Boundaries

- Do not turn this repo into a product plugin in place — fork first (see Template rule)
- Do not hand-edit `bin/plugin.js`
- No Marketplace packaging / publish flow in this template yet
