import { action } from "@elgato/streamdeck";

import { formatUsagePercent, type UsageSnapshot } from "../usage";
import { UsageKeyAction } from "./usage-key-action";

@action({ UUID: "com.local.cursor-usage.percent" })
export class ShowPercent extends UsageKeyAction {
	protected formatTitle(snap: UsageSnapshot): string {
		return formatUsagePercent(snap);
	}
}
