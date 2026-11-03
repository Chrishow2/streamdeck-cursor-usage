/** used fraction 0–1 and days until quota/billing reset */
export type UsageSnapshot = {
	usageRatio: number | null;
	daysUntilReset: number | null;
};

export type UsageProvider = {
	fetch(): Promise<UsageSnapshot>;
};
