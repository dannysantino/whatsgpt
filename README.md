# WhatsGPT

This is a WhatsApp chatbot created with Node.js and integrated with GPT-3 via an [open source ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api.git) to provide natural language processing capabilities and deliver more human-like reponses.

## Features

- Integration with GPT-3 for natural language processing
- Automatic QR code generation for easy authentication with WhatsApp Web
- MongoDB integration with Mongoose for storing and retrieving session data and chat history
- Integration with WhatsApp Web for sending and receiving messages

## How it works

The program starts by connecting to your database with Mongoose and creating a new `MongoStore` which allows for saving the session into the remote database so you don't have to scan a QR code every time you start the bot.

After successfully saving the session and starting the WhatsApp client, the bot listens for, and processes, all (and only) incoming messages, hence the need for a separate WhatsApp account so you can also send and receive messages.

## Prerequisites

- Node.js >= v18 (or >= v14 if you install a [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)), and npm
- A separate, active WhatsApp account (You can set up a WhatsApp Business account on the same mobile device)
- A Computer that can run Google Chrome (headless)
- MongoDB account and database
- OpenAI API key. Generate one [here](https://platform.openai.com/account/api-keys)

## Getting Started

To get started with the chatbot, follow these steps:

1. Clone the repository to your local machine

    `git clone https://github.com/dannysantino/whatsgpt.git`

    `cd whatsgpt`

2. Install dependencies

    `npm install`

3. Create `.env` file with the following variables

    ```js
    DB_URL=[your_mongodb_url]
    API_KEY=[your_openai_api_key]
    ```

4. Start the bot

    `npm start`

5. Use the intended WhatsApp mobile app to scan the QR code that is automatically generated in your terminal.

## Usage

Once the chatbot is set up and running, users can send text messages to the WhatsApp number associated with the bot and it will intercept, process the user's message using GPT-3, and then send a response back to the user.

## Notes

> After the initial QR scan to link the device, `RemoteAuth` takes about 1 minute to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet.

1. You should allow the program ample time to save the session, which is indicated by the message 'Session saved" logged to the console.

2. Using ChatGPT via an `apiKey` isn't free, however, you do get $18 worth of free credit when you create an account. You can monitor your usage [here](https://platform.openai.com/account/usage)

## Credits

This chatbot is made possible thanks to the following libraries:

[WhatsApp Web JS](https://github.com/pedroslopez/whatsapp-web.js.git) by [Pedro S. Lopez](https://github.com/pedroslopez)

[ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api.git) by [Travis Fischer](https://github.com/transitive-bullshit)

[QRCode Terminal](https://www.npmjs.com/package/qrcode-terminal)

## Contributing

If you would like to contribute to the chatbot, please follow these guidelines:

- Fork the repository and make your changes on a separate branch
- Test your changes thoroughly to ensure they work as expected
- Open a pull request and describe your changes

All contributions are greatly appreciated!
