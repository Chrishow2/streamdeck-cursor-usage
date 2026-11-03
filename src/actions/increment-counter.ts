import { action, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

type CounterSettings = {
	count?: number;
	incrementBy?: number;
};

@action({ UUID: "com.local.boilerplate.increment" })
export class IncrementCounter extends SingletonAction<CounterSettings> {
	private pressState = new Map<string, AbortController>();

	override async onWillAppear(ev: WillAppearEvent<CounterSettings>): Promise<void> {
		if (ev.action.isKey() || ev.action.isDial()) {
			await ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
		}
	}

	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		const timeoutId = setTimeout(() => {
			this.pressState.delete(ev.action.id);
			ev.action.setTitle("0");
			ev.action.setSettings({ ...ev.payload.settings, count: 0 });
		}, 1500);

		const controller = new AbortController();
		controller.signal.addEventListener(
			"abort",
			() => {
				this.pressState.delete(ev.action.id);
				clearTimeout(timeoutId);
			},
			{ once: true },
		);

		this.pressState.set(ev.action.id, controller);
	}

	override async onKeyUp(ev: KeyUpEvent<CounterSettings>): Promise<void> {
		const controller = this.pressState.get(ev.action.id);
		if (!controller) {
			return;
		}

		controller.abort();

		const settings = { ...ev.payload.settings };
		settings.incrementBy ??= 1;
		settings.count = (settings.count ?? 0) + settings.incrementBy;

		await ev.action.setSettings(settings);
		await ev.action.setTitle(`${settings.count}`);
	}
}
