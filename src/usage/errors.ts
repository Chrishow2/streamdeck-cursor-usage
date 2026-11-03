export type UsageErrorCode = "auth" | "network" | "parse" | "unknown";

/** fetch failed; message is safe to log (no credentials) */
export class UsageFetchError extends Error {
	readonly code: UsageErrorCode;

	constructor(code: UsageErrorCode, detail?: string) {
		super(detail ? `${code}: ${detail}` : code);
		this.name = "UsageFetchError";
		this.code = code;
	}
}
