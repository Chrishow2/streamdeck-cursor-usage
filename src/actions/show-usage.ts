import { action } from "@elgato/streamdeck";

import { formatTitle, type UsageSnapshot } from "../usage";
import { UsageKeyAction } from "./usage-key-action";

@action({ UUID: "com.local.cursor-usage.show" })
export class ShowUsage extends UsageKeyAction {
	protected formatTitle(snap: UsageSnapshot): string {
		return formatTitle(snap);
	}
}
