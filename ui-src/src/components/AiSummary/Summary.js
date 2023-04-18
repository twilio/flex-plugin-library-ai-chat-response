import React from 'react';
const Button = require("@twilio-paste/core").Button;

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
    (!isFromMe && <div>{sentiment}{summarizedText}</div>) || null
  );
};
