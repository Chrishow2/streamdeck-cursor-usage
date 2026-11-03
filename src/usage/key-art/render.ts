import type { UsageResult } from "../types";
import { RgbaCanvas, type Rgba } from "./canvas";
import { drawCenteredText } from "./font";
import { rgbaToPngDataUrl } from "./png";

const SIZE = 144;
const BG: Rgba = [8, 10, 14, 255];
const CYAN: Rgba = [0, 229, 255, 255];
const CYAN_DIM: Rgba = [0, 60, 72, 255];
const WHITE: Rgba = [245, 250, 255, 255];
const MUTED: Rgba = [140, 150, 160, 255];
const ERR_RED: Rgba = [255, 80, 100, 255];
const ERR_DIM: Rgba = [60, 20, 28, 255];

/** cyan ring + centered percent number + CURSOR label */
export function renderPercentKeyArt(result: UsageResult): string {
	const canvas = new RgbaCanvas(SIZE, SIZE);
	canvas.fill(BG);

	const cx = SIZE / 2;
	const cy = SIZE / 2 - 4;
	const outer = 58;
	const inner = 42;

	const ok = result.ok;
	const ratio = ok ? (result.snap.usageRatio ?? 0) : 0;
	const track = ok ? CYAN_DIM : ERR_DIM;
	const fill = ok ? CYAN : ERR_RED;

	canvas.strokeRing(cx, cy, inner, outer, track);

	const start = -Math.PI / 2;
	const sweep = Math.PI * 2 * Math.min(1, Math.max(0, ratio));
	if (sweep > 0.001) {
		canvas.strokeRing(cx, cy, inner, outer, fill, start, start + sweep);
	}

	const label = ok
		? result.snap.usageRatio == null
			? "-"
			: `${Math.round(result.snap.usageRatio * 100)}`
		: "ERR";
	drawCenteredText(canvas, label, cy - 2, label.length > 2 ? 4 : 5, WHITE, 1);
	drawCenteredText(canvas, "CURSOR", cy + 38, 2, MUTED, 1);

	return rgbaToPngDataUrl(SIZE, SIZE, canvas.data);
}

/** large days value + RESET label */
export function renderDaysKeyArt(result: UsageResult): string {
	const canvas = new RgbaCanvas(SIZE, SIZE);
	canvas.fill(BG);

	const value = result.ok
		? result.snap.daysUntilReset == null
			? "-d"
			: `${result.snap.daysUntilReset}d`
		: "?d";

	drawCenteredText(canvas, value, SIZE / 2 - 10, value.length > 3 ? 4 : 5, WHITE, 1);
	drawCenteredText(canvas, "RESET", SIZE / 2 + 36, 2, MUTED, 1);

	return rgbaToPngDataUrl(SIZE, SIZE, canvas.data);
}
