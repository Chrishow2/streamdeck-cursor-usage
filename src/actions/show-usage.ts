import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

type UsageSettings = {
	/** refresh interval in seconds (property inspector) */
	refreshSeconds?: number;
};

type UsageSnapshot = {
	/** used fraction 0–1, or null when unknown */
	usageRatio: number | null;
	/** days until quota/billing reset, or null when unknown */
	daysUntilReset: number | null;
};

@action({ UUID: "com.local.cursor-usage.show" })
export class ShowUsage extends SingletonAction<UsageSettings> {
	override async onWillAppear(ev: WillAppearEvent<UsageSettings>): Promise<void> {
		await this.refresh(ev.action);
	}

	override async onKeyDown(ev: KeyDownEvent<UsageSettings>): Promise<void> {
		await this.refresh(ev.action);
	}

	private async refresh(action: WillAppearEvent["action"] | KeyDownEvent["action"]): Promise<void> {
		if (!action.isKey()) {
			return;
		}

		const snap = await this.fetchUsage();
		await action.setTitle(this.formatTitle(snap));
	}

	/** placeholder until Cursor usage API / local source is wired */
	private async fetchUsage(): Promise<UsageSnapshot> {
		return { usageRatio: null, daysUntilReset: null };
	}

	private formatTitle(snap: UsageSnapshot): string {
		const usage =
			snap.usageRatio == null ? "—%" : `${Math.round(snap.usageRatio * 100)}%`;
		const days =
			snap.daysUntilReset == null ? "—d" : `${snap.daysUntilReset}d`;
		return `${usage}\n${days}`;
	}
}
