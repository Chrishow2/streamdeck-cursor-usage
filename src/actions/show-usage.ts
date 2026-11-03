import { action } from "@elgato/streamdeck";

import { formatTitleResult, type UsageResult } from "../usage";
import { UsageKeyAction } from "./usage-key-action";

@action({ UUID: "com.local.cursor-usage.show" })
export class ShowUsage extends UsageKeyAction {
	protected formatTitle(result: UsageResult): string {
		return formatTitleResult(result);
	}
}
