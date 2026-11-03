import { CursorCloudUsageProvider } from "./cursor-cloud-provider";
import { MockUsageProvider } from "./mock-provider";
import type { UsageProvider } from "./types";

export type ProviderSettings = {
	/** Cursor access token or WorkosCursorSessionToken (cookie or raw value) */
	accessToken?: string;
	/** force mock even if a token is present */
	useMock?: boolean | string;
};

const mock = new MockUsageProvider();

/** pick mock when no credential; otherwise Cursor cloud HTTPS only */
export function resolveProvider(settings: ProviderSettings): UsageProvider {
	if (isTruthy(settings.useMock)) {
		return mock;
	}

	const token = settings.accessToken?.trim();
	if (!token) {
		return mock;
	}

	return new CursorCloudUsageProvider(token);
}

function isTruthy(value: boolean | string | undefined): boolean {
	if (value === true) {
		return true;
	}
	if (typeof value === "string") {
		return value === "true" || value === "1";
	}
	return false;
}
