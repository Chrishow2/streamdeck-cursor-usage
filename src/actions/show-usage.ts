import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { formatTitle, type UsageProvider } from "../usage";

type UsageSettings = {
	/** refresh interval in seconds (property inspector) */
	refreshSeconds?: number;
};

@action({ UUID: "com.local.cursor-usage.show" })
export class ShowUsage extends SingletonAction<UsageSettings> {
	constructor(private readonly provider: UsageProvider) {
		super();
	}

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

		const snap = await this.provider.fetch();
		await action.setTitle(formatTitle(snap));
	}
}
