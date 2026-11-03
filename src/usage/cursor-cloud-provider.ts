import { UsageFetchError } from "./errors";
import type { UsageProvider, UsageSnapshot } from "./types";

const CONNECT_URL = "https://api2.cursor.sh/aiserver.v1.DashboardService/GetCurrentPeriodUsage";
const SUMMARY_URL = "https://cursor.com/api/usage-summary";

/**
 * Fetches usage from Cursor over HTTPS using a credential from Stream Deck settings.
 * Does not read the Cursor IDE profile or state.vscdb.
 */
export class CursorCloudUsageProvider implements UsageProvider {
	constructor(private readonly credential: string) {}

	async fetch(): Promise<UsageSnapshot> {
		const cred = normalizeCredential(this.credential);
		if (!cred) {
			throw new UsageFetchError("auth", "missing credential");
		}

		try {
			return await fetchViaConnect(cred.bearer);
		} catch (first) {
			if (cred.cookie) {
				try {
					return await fetchViaUsageSummary(cred.cookie);
				} catch (second) {
					throw preferUsageError(second, first);
				}
			}
			throw toUsageError(first);
		}
	}
}

type NormalizedCredential = {
	bearer: string;
	cookie?: string;
};

function normalizeCredential(raw: string): NormalizedCredential | null {
	const trimmed = raw.trim();
	if (!trimmed) {
		return null;
	}

	const cookieMatch = trimmed.match(/WorkosCursorSessionToken=([^;\s]+)/i);
	if (cookieMatch?.[1]) {
		const cookieVal = decodeURIComponent(cookieMatch[1]);
		return {
			bearer: extractBearerFromSession(cookieVal) ?? cookieVal,
			cookie: `WorkosCursorSessionToken=${cookieMatch[1]}`,
		};
	}

	if (trimmed.includes("::") || trimmed.includes("%3A%3A")) {
		const decoded = decodeURIComponent(trimmed);
		return {
			bearer: extractBearerFromSession(decoded) ?? decoded,
			cookie: `WorkosCursorSessionToken=${trimmed}`,
		};
	}

	return { bearer: trimmed.replace(/^Bearer\s+/i, "") };
}

function extractBearerFromSession(session: string): string | null {
	const parts = session.split("::");
	if (parts.length >= 2 && parts[parts.length - 1]) {
		return parts[parts.length - 1]!;
	}
	return null;
}

async function fetchViaConnect(bearer: string): Promise<UsageSnapshot> {
	let res: Response;
	try {
		res = await fetch(CONNECT_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${bearer}`,
				"Content-Type": "application/json",
				"Connect-Protocol-Version": "1",
			},
			body: "{}",
		});
	} catch {
		throw new UsageFetchError("network", "connect unreachable");
	}

	if (!res.ok) {
		throw httpUsageError(res.status, "connect");
	}

	try {
		const body = (await res.json()) as Record<string, unknown>;
		return snapshotFromConnect(body);
	} catch {
		throw new UsageFetchError("parse", "connect body");
	}
}

async function fetchViaUsageSummary(cookieHeader: string): Promise<UsageSnapshot> {
	let res: Response;
	try {
		res = await fetch(SUMMARY_URL, {
			method: "GET",
			headers: {
				Cookie: cookieHeader,
				Origin: "https://cursor.com",
			},
		});
	} catch {
		throw new UsageFetchError("network", "usage-summary unreachable");
	}

	if (!res.ok) {
		throw httpUsageError(res.status, "usage-summary");
	}

	try {
		const body = (await res.json()) as Record<string, unknown>;
		return snapshotFromUsageSummary(body);
	} catch {
		throw new UsageFetchError("parse", "usage-summary body");
	}
}

function httpUsageError(status: number, where: string): UsageFetchError {
	if (status === 401 || status === 403) {
		return new UsageFetchError("auth", `${where} HTTP ${status}`);
	}
	if (status >= 500) {
		return new UsageFetchError("network", `${where} HTTP ${status}`);
	}
	return new UsageFetchError("unknown", `${where} HTTP ${status}`);
}

function toUsageError(error: unknown): UsageFetchError {
	return error instanceof UsageFetchError ? error : new UsageFetchError("unknown");
}

function preferUsageError(primary: unknown, fallback: unknown): UsageFetchError {
	const a = toUsageError(primary);
	const b = toUsageError(fallback);
	if (a.code === "auth" || b.code === "auth") {
		return a.code === "auth" ? a : b;
	}
	return a;
}

function snapshotFromConnect(body: Record<string, unknown>): UsageSnapshot {
	const planUsage = asRecord(body.planUsage) ?? asRecord(body.plan_usage);
	const percent = firstNumber(
		planUsage?.totalPercentUsed,
		planUsage?.total_percent_used,
		body.totalPercentUsed,
	);
	const end = firstDefined(body.billingCycleEnd, body.billing_cycle_end);

	return {
		usageRatio: percent == null ? null : clampRatio(percent / 100),
		daysUntilReset: daysUntilMs(end),
	};
}

function snapshotFromUsageSummary(body: Record<string, unknown>): UsageSnapshot {
	const individual = asRecord(body.individualUsage) ?? asRecord(body.individual_usage);
	const plan = asRecord(individual?.plan);
	const percent = firstNumber(plan?.totalPercentUsed, plan?.total_percent_used);
	const used = firstNumber(plan?.used);
	const limit = firstNumber(plan?.limit);
	const ratio =
		percent != null
			? clampRatio(percent / 100)
			: used != null && limit != null && limit > 0
				? clampRatio(used / limit)
				: null;

	return {
		usageRatio: ratio,
		daysUntilReset: daysUntilMs(firstDefined(body.billingCycleEnd, body.billing_cycle_end)),
	};
}

function daysUntilMs(value: unknown): number | null {
	const ms = parseTimeMs(value);
	if (ms == null) {
		return null;
	}
	return Math.max(0, Math.ceil((ms - Date.now()) / 86_400_000));
}

function parseTimeMs(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value < 1e12 ? value * 1000 : value;
	}
	if (typeof value === "string" && value.trim()) {
		const asNum = Number(value);
		if (Number.isFinite(asNum)) {
			return asNum < 1e12 ? asNum * 1000 : asNum;
		}
		const parsed = Date.parse(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function clampRatio(n: number): number {
	if (!Number.isFinite(n)) {
		return 0;
	}
	return Math.min(1, Math.max(0, n));
}

function asRecord(value: unknown): Record<string, unknown> | null {
	return value != null && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function firstNumber(...values: unknown[]): number | null {
	for (const v of values) {
		if (typeof v === "number" && Number.isFinite(v)) {
			return v;
		}
		if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) {
			return Number(v);
		}
	}
	return null;
}

function firstDefined(...values: unknown[]): unknown {
	return values.find((v) => v != null && v !== "");
}
