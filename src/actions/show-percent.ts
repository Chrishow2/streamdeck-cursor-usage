import { action } from "@elgato/streamdeck";

import { formatUsagePercentResult, renderPercentKeyArt, type UsageResult } from "../usage";
import { UsageKeyAction } from "./usage-key-action";

@action({ UUID: "com.local.cursor-usage.percent" })
export class ShowPercent extends UsageKeyAction {
	protected formatTitle(result: UsageResult): string {
		return formatUsagePercentResult(result);
	}

	protected override renderKeyArt(result: UsageResult): string {
		return renderPercentKeyArt(result);
	}
}
