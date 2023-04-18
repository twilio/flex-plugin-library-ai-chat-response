import { Manager } from "@twilio/flex-ui";

export async function fetchOpenAIResponse(input, requestType, context = "") {
  const token =
    Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token;

  const options = {};
  options.method = "POST";
  options.body = new URLSearchParams({
    input: input,
    requestType: requestType,
    Token: token,
    context: context,
  });
  options.headers = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };

  const response = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.FLEX_APP_SERVERLESS_FUNCTONS_DOMAIN}/gpt4`,
    options
  );

  if (response.status == "431") {
    return "431";
  }

  if (!response.ok) {
    console.error(
      `Failed to retrieve ${requestType} response: ${response.status}`
    );
    return null;
  }

  const data = await response.json();

  return data.summary;
}
