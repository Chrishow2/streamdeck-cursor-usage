export type Rgba = readonly [number, number, number, number];

export class RgbaCanvas {
	readonly data: Uint8Array;

	constructor(
		readonly width: number,
		readonly height: number,
	) {
		this.data = new Uint8Array(width * height * 4);
	}

	fill(color: Rgba): void {
		for (let i = 0; i < this.data.length; i += 4) {
			this.data[i] = color[0];
			this.data[i + 1] = color[1];
			this.data[i + 2] = color[2];
			this.data[i + 3] = color[3];
		}
	}

	setPixel(x: number, y: number, color: Rgba): void {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
			return;
		}
		const i = (y * this.width + x) * 4;
		this.data[i] = color[0];
		this.data[i + 1] = color[1];
		this.data[i + 2] = color[2];
		this.data[i + 3] = color[3];
	}

	fillCircle(cx: number, cy: number, radius: number, color: Rgba): void {
		const r2 = radius * radius;
		const x0 = Math.max(0, Math.floor(cx - radius));
		const x1 = Math.min(this.width - 1, Math.ceil(cx + radius));
		const y0 = Math.max(0, Math.floor(cy - radius));
		const y1 = Math.min(this.height - 1, Math.ceil(cy + radius));
		for (let y = y0; y <= y1; y++) {
			for (let x = x0; x <= x1; x++) {
				const dx = x + 0.5 - cx;
				const dy = y + 0.5 - cy;
				if (dx * dx + dy * dy <= r2) {
					this.setPixel(x, y, color);
				}
			}
		}
	}

	/** ring between innerR and outerR; arc from startAngle toward endAngle (radians, 0 = east, CCW) */
	strokeRing(
		cx: number,
		cy: number,
		innerR: number,
		outerR: number,
		color: Rgba,
		startAngle = 0,
		endAngle = Math.PI * 2,
	): void {
		const span = Math.max(0, endAngle - startAngle);
		const full = span >= Math.PI * 2 - 1e-6;
		const x0 = Math.max(0, Math.floor(cx - outerR));
		const x1 = Math.min(this.width - 1, Math.ceil(cx + outerR));
		const y0 = Math.max(0, Math.floor(cy - outerR));
		const y1 = Math.min(this.height - 1, Math.ceil(cy + outerR));
		const inner2 = innerR * innerR;
		const outer2 = outerR * outerR;
		const twoPi = Math.PI * 2;

		for (let y = y0; y <= y1; y++) {
			for (let x = x0; x <= x1; x++) {
				const dx = x + 0.5 - cx;
				const dy = y + 0.5 - cy;
				const d2 = dx * dx + dy * dy;
				if (d2 < inner2 || d2 > outer2) {
					continue;
				}
				if (full) {
					this.setPixel(x, y, color);
					continue;
				}
				let delta = Math.atan2(dy, dx) - startAngle;
				while (delta < 0) {
					delta += twoPi;
				}
				while (delta >= twoPi) {
					delta -= twoPi;
				}
				if (delta <= span) {
					this.setPixel(x, y, color);
				}
			}
		}
	}
}
