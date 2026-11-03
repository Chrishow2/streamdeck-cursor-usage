import streamDeck from "@elgato/streamdeck";
import {
	DialAction,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from "@elgato/streamdeck";

import {
	UsageFetchError,
	resolveProvider,
	type ProviderSettings,
	type UsageResult,
} from "../usage";

export type UsageSettings = ProviderSettings & {
	/** refresh interval in seconds (property inspector) */
	refreshSeconds?: number;
};

const REFRESH_MIN = 30;
const REFRESH_MAX = 600;
const REFRESH_DEFAULT = 120;

/** shared fetch/timer/settings for usage-related keys */
export abstract class UsageKeyAction extends SingletonAction<UsageSettings> {
	private readonly timers = new Map<string, ReturnType<typeof setInterval>>();
	private readonly settingsByAction = new Map<string, UsageSettings>();

	protected abstract formatTitle(result: UsageResult): string;

	override async onWillAppear(ev: WillAppearEvent<UsageSettings>): Promise<void> {
		this.settingsByAction.set(ev.action.id, ev.payload.settings);
		await this.refresh(ev.action, ev.payload.settings);
		this.armTimer(ev.action, ev.payload.settings);
	}

	override async onWillDisappear(ev: WillDisappearEvent<UsageSettings>): Promise<void> {
		this.clearTimer(ev.action.id);
		this.settingsByAction.delete(ev.action.id);
	}

	override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<UsageSettings>): Promise<void> {
		this.settingsByAction.set(ev.action.id, ev.payload.settings);
		await this.refresh(ev.action, ev.payload.settings);
		this.armTimer(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<UsageSettings>): Promise<void> {
		const settings = this.settingsByAction.get(ev.action.id) ?? ev.payload.settings;
		await this.refresh(ev.action, settings);
	}

	private armTimer(
		action: KeyAction<UsageSettings> | DialAction<UsageSettings>,
		settings: UsageSettings,
	): void {
		if (!action.isKey()) {
			return;
		}

		const seconds = clampRefreshSeconds(settings.refreshSeconds);
		this.clearTimer(action.id);

		const handle = setInterval(() => {
			const latest = this.settingsByAction.get(action.id) ?? settings;
			void this.refresh(action, latest);
		}, seconds * 1000);

		this.timers.set(action.id, handle);
	}

	private clearTimer(actionId: string): void {
		const handle = this.timers.get(actionId);
		if (handle == null) {
			return;
		}
		clearInterval(handle);
		this.timers.delete(actionId);
	}

	private async refresh(
		action: KeyAction<UsageSettings> | DialAction<UsageSettings>,
		settings: UsageSettings,
	): Promise<void> {
		if (!action.isKey()) {
			return;
		}

		const result = await this.loadResult(settings);
		await action.setTitle(this.formatTitle(result));
	}

	private async loadResult(settings: UsageSettings): Promise<UsageResult> {
		try {
			const snap = await resolveProvider(settings).fetch();
			return { ok: true, snap };
		} catch (error) {
			const code = error instanceof UsageFetchError ? error.code : "unknown";
			streamDeck.logger.warn(`usage fetch failed (${code})`);
			return { ok: false, code };
		}
	}
}

function clampRefreshSeconds(value: unknown): number {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) {
		return REFRESH_DEFAULT;
	}
	return Math.min(REFRESH_MAX, Math.max(REFRESH_MIN, Math.round(n)));
}
