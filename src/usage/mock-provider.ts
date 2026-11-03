import type { UsageProvider, UsageSnapshot } from "./types";

/** deterministic fixture for local Stream Deck demos (42% / 12d) */
export class MockUsageProvider implements UsageProvider {
	async fetch(): Promise<UsageSnapshot> {
		return { usageRatio: 0.42, daysUntilReset: 12 };
	}
}
