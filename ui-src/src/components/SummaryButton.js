import { Button } from "@twilio-paste/core";

import React, { useState } from "react";
import { fetchOpenAIResponse } from "../services/fetchOpenAIResponse";

export default function (props) {
  const {
    isFromMe,
    source: {
      state: {
        // eslint-disable-next-line no-unused-vars
        attributes: { summarizedText },
      },
    },
  } = props.message;

  const [summaryEnabled, setSummaryEnabled] = useState("true");
  const [summaryThreshold, setSummaryThreshold] = useState(10);
  console.log("summaryThreshold" + summaryThreshold);

  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    const button = document.querySelector("button");
    if (button) {
      button.disabled = disabled;
    }
  }, [disabled]);

  const callApi = async (messageBody, messageSid) => {
    try {
      const summary = await fetchOpenAIResponse(messageBody, "summary");
      const newSummaryText = "Summary (AI):" + summary;
      // Add the summarized text to the message attributes
      props.message.source.state.attributes.summarizedText = newSummaryText;
      // Disable the button after a successful API call
      setDisabled(true);
    } catch (error) {
      console.error("Error summarizing message:", error);
    }
  };

  const addSummaryToMessage = () => {
    const messageBody = props.message?.source?.state?.body;
    const messageSid = props.message?.source?.state?.sid;

    if (messageBody) {
      callApi(messageBody, messageSid);
    }
  };

  return (
    (summaryEnabled === true &&
      !isFromMe &&
      props.message?.source?.state?.body.length > Number(summaryThreshold) && (
        <Button
          onClick={addSummaryToMessage}
          variant="primary"
          disabled={disabled}
        >
          AI Summary{" "}
        </Button>
      )) ||
    null
  );
}
