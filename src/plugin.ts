import streamDeck from "@elgato/streamdeck";

import { ShowUsage } from "./actions/show-usage";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new ShowUsage());
streamDeck.connect();
