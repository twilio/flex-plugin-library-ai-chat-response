import React from "react";
import { FlexPlugin } from "@twilio/flex-plugin";
import { CustomizationProvider } from "@twilio-paste/core/customization";
import SummaryButton from "./components/SummaryButton";
import Summary from "./components/Summary";
import Suggestion from "./components/Suggestion";

const PLUGIN_NAME = "OpenAiSuggestPlugin";

export default class OpenAiSuggestPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex, manager) {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    flex.MessageInputActions.Content.add(
      <Suggestion
        key="Suggestion"
        session={manager.store.getState().flex.session}
      ></Suggestion>
    );

    flex.MessageBubble.Content.add(
      <SummaryButton key="button-in-bubble"></SummaryButton>
    );
    flex.MessageBubble.Content.add(<Summary key="summary-in-bubble"></Summary>);
  }
}
