# ai-autoresponse

1. 	AI Responses – provide the ability for agents to generate AI-powered responses to customer inquiries in real-time. This tool leverages OpenAI's natural language processing capabilities to generate helpful responses to customer queries.
2. 	AI Summary – provides the ability to summarize text that exceeds a user-defined character limit. This can be helpful for agents who must read through a lengthy and occasionally complicated message, and should enable them to understand the message's main points before responding. 

# setup and dependencies

During installation, 1 field is required:

 1. *Open AI API Key*: You may want to create a new open AI API key incase you dont have one already.
    [Get your OpenAI key](https://platform.openai.com/account/api-keys)

## How it works
### Suggested response ###
To Test the suggestion function: upon receiving a message from the user, click on the Suggest Response button: 

### Summary ###
To test the summary function as a user, type a long message (bigger than the defined threshold in the `SummaryButton.js` file)  to the conversation window, then click on the AI Summary button. A summary of the message will be displayed using OpenaAi’s GTP model:


