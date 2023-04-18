import React from "react";

// eslint-disable-next-line react/display-name
export default function (props) {
  const {
    isFromMe,
    source: {
      state: {
        attributes: { sentiment, summarizedText },
      },
    },
  } = props.message;

  return (
    (!isFromMe && (
      <div>
        {sentiment}
        {summarizedText}
      </div>
    )) ||
    null
  );
}
