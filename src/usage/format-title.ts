import type { UsageResult, UsageSnapshot } from "./types";

export function formatUsagePercent(snap: UsageSnapshot): string {
	return snap.usageRatio == null ? "—%" : `${Math.round(snap.usageRatio * 100)}%`;
}

export function formatDaysUntilReset(snap: UsageSnapshot): string {
	return snap.daysUntilReset == null ? "—d" : `${snap.daysUntilReset}d`;
}

/** combined key title (overview) */
export function formatTitle(snap: UsageSnapshot): string {
	return `${formatUsagePercent(snap)}\n${formatDaysUntilReset(snap)}`;
}

export function formatUsagePercentResult(result: UsageResult): string {
	return result.ok ? formatUsagePercent(result.snap) : "ERR";
}

export function formatDaysUntilResetResult(result: UsageResult): string {
	return result.ok ? formatDaysUntilReset(result.snap) : "?d";
}

export function formatTitleResult(result: UsageResult): string {
	return result.ok ? formatTitle(result.snap) : "ERR\n?d";
}
