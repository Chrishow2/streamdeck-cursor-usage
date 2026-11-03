import type { UsageErrorCode } from "./errors";

/** used fraction 0–1 and days until quota/billing reset */
export type UsageSnapshot = {
	usageRatio: number | null;
	daysUntilReset: number | null;
};

export type UsageResult =
	| { ok: true; snap: UsageSnapshot }
	| { ok: false; code: UsageErrorCode };

export type UsageProvider = {
	fetch(): Promise<UsageSnapshot>;
};
