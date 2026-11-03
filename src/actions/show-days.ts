import { action } from "@elgato/streamdeck";

import { formatDaysUntilResetResult, type UsageResult } from "../usage";
import { UsageKeyAction } from "./usage-key-action";

@action({ UUID: "com.local.cursor-usage.days" })
export class ShowDays extends UsageKeyAction {
	protected formatTitle(result: UsageResult): string {
		return formatDaysUntilResetResult(result);
	}
}
