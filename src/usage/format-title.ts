import type { UsageSnapshot } from "./types";

export function formatTitle(snap: UsageSnapshot): string {
	const usage = snap.usageRatio == null ? "—%" : `${Math.round(snap.usageRatio * 100)}%`;
	const days = snap.daysUntilReset == null ? "—d" : `${snap.daysUntilReset}d`;
	return `${usage}\n${days}`;
}
