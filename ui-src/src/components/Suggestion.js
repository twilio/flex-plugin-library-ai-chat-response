/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Button } from "@twilio/flex-ui";
import * as Flex from "@twilio/flex-ui";
import { fetchOpenAIResponse } from "../services/fetchOpenAIResponse";
import { Spinner } from "@twilio-paste/core/spinner";

const Suggestion = ({ conversationSid }) => {
  const [suggestedResponseEnabled, setSuggestedResponseEnabled] =
    useState("true");
  console.log("suggested response enabled var:" + suggestedResponseEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [currResponse, setCurrResponse] = useState("");
  const [lastCustomerMessage, setLastCustomerMessage] = useState("");

  let context;
  if (process.env.REACT_APP_CONTEXT) {
    context = process.env.REACT_APP_CONTEXT;
    context = context.replace(/[^a-zA-Z0-9 ]/g, "");
  }
  useEffect(() => {
    let isMounted = true;
    Flex.Manager.getInstance().store.subscribe(() => {
      if (isMounted) {
        const conversation = Object.values(
          window.Twilio.Flex.Manager.getInstance().store.getState().flex.chat
            .conversations
        )[0];
        console.log("conversation: ", conversation);
        if (conversation && conversation.messages) {
          const messages = conversation.messages;
          const lastCustomerMessageIndex = messages
            .slice()
            .reverse()
            .findIndex((m) => !m.isFromMe);
          if (lastCustomerMessageIndex >= 0) {
            const lastCustomerMessage =
              messages[messages.length - 1 - lastCustomerMessageIndex];
            setLastCustomerMessage(
              lastCustomerMessage.source.body
                .replace(/\s+/g, " ")
                .trim()
                .replace(/[^a-zA-Z0-9 ]/g, "")
            );
          } else {
            setLastCustomerMessage("");
          }
          const response =
            Flex.Manager.getInstance().store.getState().flex.chat
              .conversationInput[conversationSid].inputText;
          setCurrResponse(response);
        } else {
          setLastCustomerMessage("");
        }
      }
    });
    return () => {
      isMounted = false; // set isMounted to false when the component unmounts
    };
  }, [conversationSid]);

  const handleSuggestedResponseClick = async () => {
    if (!suggestedResponseEnabled) {
      return;
    }

    try {
      setIsLoading(true);
      let suggestedResponse = await fetchOpenAIResponse(
        lastCustomerMessage,
        "suggest",
        context
      );
      suggestedResponse = suggestedResponse.trim();
      Flex.Actions.invokeAction("SetInputText", {
        body: suggestedResponse,
        conversationSid: conversationSid,
      });
    } catch (error) {
      console.error(error);
      alert("Sorry, there was an error retrieving the suggested response.");
    } finally {
      setIsLoading(false);
      localStorage.clear();
    }
  };

  return (
    suggestedResponseEnabled && (
      <Button
        size="small"
        disabled={isLoading}
        variant="primary"
        onClick={handleSuggestedResponseClick}
      >
        AI Response{" "}
        {isLoading && <Spinner decorative={false} title="Loading" />}
      </Button>
    )
  );
};

export default Suggestion;
