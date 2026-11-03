import type { Rgba, RgbaCanvas } from "./canvas";

/** 5x7 bitmap glyphs for labels/numbers (1 = pixel on) */
const GLYPHS: Record<string, string[]> = {
	"0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
	"1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
	"2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
	"3": ["01110", "10001", "00001", "00110", "00001", "10001", "01110"],
	"4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
	"5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
	"6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
	"7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
	"8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
	"9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
	"%": ["11001", "11010", "00100", "01000", "00100", "01011", "10011"],
	"-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
	"?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
	d: ["00001", "00001", "01111", "10001", "10001", "10001", "01111"],
	E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
	R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
	S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
	T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
	C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
	U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
	O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
	" ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

export function measureText(text: string, scale: number, tracking = 1): number {
	const glyphW = 5 * scale;
	const gap = tracking * scale;
	return text.length * glyphW + Math.max(0, text.length - 1) * gap;
}

export function drawText(
	canvas: RgbaCanvas,
	text: string,
	x: number,
	y: number,
	scale: number,
	color: Rgba,
	tracking = 1,
): void {
	let cursor = x;
	const gap = tracking * scale;
	for (const ch of text) {
		const glyph = GLYPHS[ch] ?? GLYPHS["?"]!;
		for (let row = 0; row < 7; row++) {
			const line = glyph[row]!;
			for (let col = 0; col < 5; col++) {
				if (line[col] === "1") {
					for (let dy = 0; dy < scale; dy++) {
						for (let dx = 0; dx < scale; dx++) {
							canvas.setPixel(cursor + col * scale + dx, y + row * scale + dy, color);
						}
					}
				}
			}
		}
		cursor += 5 * scale + gap;
	}
}

export function drawCenteredText(
	canvas: RgbaCanvas,
	text: string,
	cy: number,
	scale: number,
	color: Rgba,
	tracking = 1,
): void {
	const width = measureText(text, scale, tracking);
	const x = Math.round((canvas.width - width) / 2);
	const y = Math.round(cy - (7 * scale) / 2);
	drawText(canvas, text, x, y, scale, color, tracking);
}
