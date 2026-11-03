import streamDeck from "@elgato/streamdeck";

import { ShowDays } from "./actions/show-days";
import { ShowPercent } from "./actions/show-percent";
import { ShowUsage } from "./actions/show-usage";

streamDeck.logger.setLevel("warn");

streamDeck.actions.registerAction(new ShowPercent());
streamDeck.actions.registerAction(new ShowDays());
streamDeck.actions.registerAction(new ShowUsage());
streamDeck.connect();
