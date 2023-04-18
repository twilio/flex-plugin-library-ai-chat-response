const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  // Importing required modules
  const { Configuration, OpenAIApi } = require("openai");

  // Getting spoken input and request type from the event
  //const spokenInput = event.spokeninput;
  const spokenInput = event.input;

  const requestType = event.requestType;

  // Getting event context, if any
  const eventcontext = event.context;

  console.log("this is what i got from flex:", spokenInput);

  // Getting the API key from Twilio environment variables
  const API_KEY = process.env.OPENAI_API_KEY;
  const API_MODEL = context.API_MODEL;

  // Creating a new configuration object with the OpenAI API key
  const configuration = new Configuration({
    apiKey: API_KEY,
  });

  // Creating a new OpenAI API client
  const openai = new OpenAIApi(configuration);

  // Setting the prompt based on the request type and context, if any
  let prompt = spokenInput;
  if (requestType === "summary") {
    prompt = `write me a short summary , max three lines of this: ${spokenInput}`;
  }
  if (requestType === "suggest" && eventcontext) {
    prompt = `play a role game imagine that you are a customer service agent , I will ask you a question  if you think you can respond and it is a good response, then please respond with a short suggested response, DO NOT use a prefix with colon i.e suggested response,  here is my question : ${spokenInput} if relevant take into account the following information but only use it if is related to the question :  ${eventcontext}  `;
  }
  if (requestType === "suggest" && !eventcontext) {
    prompt = `play a role game imagine that you are a customer service agent , I will ask you a question  if you think you can respond and it is  a good enough response  , then please respond with three lines max , DO NOT use a prefix with colon i.e suggested response, here is my question : ${spokenInput}   `;
  }

  // Sending a request to the OpenAI API to create a completion based on the prompt

  //Model has to be set under ennvirmental variable using API_MODEL and model name from openapi
  //if it is not set it will default to gpt-3.5-turbo

  if (!API_MODEL) {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      })
      .then((completion) => {
        // Extracting the summary from the OpenAI API response
        const summary = completion.data.choices[0].message.content;
        response.appendHeader("Content-Type", "application/json");
        response.setBody({ summary });
        callback(null, response);
      })
      .catch((error) => {
        response.appendHeader("Content-Type", "plain/text");
        response.setBody(error.message);
        response.setStatusCode(500);
        callback(null, response);
      });
  } else if (API_MODEL.startsWith("gpt-")) {
    openai
      .createChatCompletion({
        model: API_MODEL,
        messages: [{ role: "user", content: prompt }],
      })
      .then((completion) => {
        // Extracting the summary from the OpenAI API response
        const summary = completion.data.choices[0].message.content;
        response.appendHeader("Content-Type", "application/json");
        response.setBody({ summary });
        callback(null, response);
      })
      .catch((error) => {
        response.appendHeader("Content-Type", "plain/text");
        response.setBody(error.message);
        response.setStatusCode(500);
        callback(null, response);
      });
  } else if (API_MODEL.startsWith("text-")) {
    //default model is text-davinci-003
    openai
      .createCompletion({
        model: "model: API_MODEL",
        prompt,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((data) => {
        // Extracting the summary from the OpenAI API response
        const summary = data.data.choices[0].text;
        response.appendHeader("Content-Type", "application/json");
        response.setBody({ summary });
        callback(null, response);
      })
      .catch((error) => {
        response.appendHeader("Content-Type", "plain/text");
        response.setBody(error.message);
        response.setStatusCode(500);
        callback(null, response);
      });
  } else {
    const response = new Twilio.Response();
    response.appendHeader("Content-Type", "plain/text");
    response.setBody(
      "Invalid model parameter only gpt and text models supported"
    );
    response.setStatusCode(400);
    return callback(null, response);
  }
});
