import streamDeck from "@elgato/streamdeck";

import { ShowUsage } from "./actions/show-usage";
import { MockUsageProvider } from "./usage";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new ShowUsage(new MockUsageProvider()));
streamDeck.connect();
