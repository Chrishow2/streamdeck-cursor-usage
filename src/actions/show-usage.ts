import {
	action,
	DialAction,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from "@elgato/streamdeck";

import { formatTitle, type UsageProvider } from "../usage";

type UsageSettings = {
	/** refresh interval in seconds (property inspector) */
	refreshSeconds?: number;
};

const REFRESH_MIN = 30;
const REFRESH_MAX = 600;
const REFRESH_DEFAULT = 120;

@action({ UUID: "com.local.cursor-usage.show" })
export class ShowUsage extends SingletonAction<UsageSettings> {
	private readonly timers = new Map<string, ReturnType<typeof setInterval>>();

	constructor(private readonly provider: UsageProvider) {
		super();
	}

	override async onWillAppear(ev: WillAppearEvent<UsageSettings>): Promise<void> {
		await this.refresh(ev.action);
		this.armTimer(ev.action, ev.payload.settings);
	}

	override async onWillDisappear(ev: WillDisappearEvent<UsageSettings>): Promise<void> {
		this.clearTimer(ev.action.id);
	}

	override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<UsageSettings>): Promise<void> {
		await this.refresh(ev.action);
		this.armTimer(ev.action, ev.payload.settings);
	}

	override async onKeyDown(ev: KeyDownEvent<UsageSettings>): Promise<void> {
		await this.refresh(ev.action);
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
			void this.refresh(action);
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

	private async refresh(action: KeyAction<UsageSettings> | DialAction<UsageSettings>): Promise<void> {
		if (!action.isKey()) {
			return;
		}

		const snap = await this.provider.fetch();
		await action.setTitle(formatTitle(snap));
	}
}

function clampRefreshSeconds(value: unknown): number {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) {
		return REFRESH_DEFAULT;
	}
	return Math.min(REFRESH_MAX, Math.max(REFRESH_MIN, Math.round(n)));
}
