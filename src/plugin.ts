import streamDeck from "@elgato/streamdeck";

import { IncrementCounter } from "./actions/increment-counter";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.connect();
