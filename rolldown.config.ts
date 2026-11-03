import { exec } from "node:child_process";
import path from "node:path";
import url from "node:url";

import { defineConfig } from "rolldown";

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "com.local.cursor-usage";
const sdPluginFolder = `${sdPlugin}.sdPlugin`;
const canRestart = process.env.STREAMDECK_RESTART !== "0";

const config = defineConfig({
	input: "src/plugin.ts",
	output: {
		file: `${sdPluginFolder}/bin/plugin.js`,
		sourcemap: isWatching,
		sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
			return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath)).href;
		},
		minify: !isWatching,
	},
	transform: {
		decorator: {
			legacy: true,
		},
	},
	platform: "node",
	resolve: {
		conditionNames: ["node"],
	},
	plugins: [
		{
			name: "watch-externals",
			buildStart() {
				this.addWatchFile(`${sdPluginFolder}/manifest.json`);
			},
			writeBundle() {
				if (!isWatching || !canRestart) {
					if (isWatching && !canRestart) {
						console.log(`[watch] built ${sdPluginFolder} — restart the plugin in Stream Deck on the host`);
					}
					return;
				}

				exec(`streamdeck restart ${sdPlugin}`, (error, stdout, stderr) => {
					if (stdout) console.log(stdout.trim());
					if (stderr) console.error(stderr.trim());
					if (error) {
						console.log(`[watch] built ${sdPluginFolder} — restart Stream Deck manually (no host CLI in Docker)`);
					}
				});
			},
		},
		{
			name: "emit-module-package-file",
			generateBundle() {
				this.emitFile({ fileName: "package.json", source: `{ "type": "module" }`, type: "asset" });
			},
		},
	],
});

export default config;
