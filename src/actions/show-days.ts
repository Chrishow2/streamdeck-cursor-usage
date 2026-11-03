import { action } from "@elgato/streamdeck";

import { formatDaysUntilReset, type UsageSnapshot } from "../usage";
import { UsageKeyAction } from "./usage-key-action";

@action({ UUID: "com.local.cursor-usage.days" })
export class ShowDays extends UsageKeyAction {
	protected formatTitle(snap: UsageSnapshot): string {
		return formatDaysUntilReset(snap);
	}
}
