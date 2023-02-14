import * as dotenv from "dotenv"
dotenv.config();

import whatsappweb from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
import qrcode from "qrcode-terminal"

import { ChatGPTAPI } from "chatgpt";

const { Client, RemoteAuth } = whatsappweb;

const api = new ChatGPTAPI({ apiKey: process.env.API_KEY});

let conversationId,
    parentMessageId;
    
const sendMessage = async message => {
    try {
        console.log(`Message received from: ${message.from}`);

        const response = await api.sendMessage(message.body, conversationId && {
            conversationId,
            parentMessageId
        });
        
        conversationId = response.conversationId;
        parentMessageId = response.parentMessageId;

        console.log("ChatGPT reply received");
        
        return response;
    } catch (err) {
        throw new Error("Message Error", { cause: err });
    }
}

mongoose.connect(process.env.DB_URL)
    .then(() => {
        const store = new MongoStore({ mongoose });
        const whatsapp = new Client({
            authStrategy: new RemoteAuth({
                store,
                backupSyncIntervalMs: 300000
            })
        });

        whatsapp.on("remote_session_saved", () => console.log("Session saved"));

        whatsapp.on("qr", qr => qrcode.generate(qr, { small: true }));

        whatsapp.on("ready", () => console.log("WhatsApp Client ready!"));

        whatsapp.on("message", async message => {
            if (message.hasMedia) {
                message.reply("Sorry, media files cannot be handled at this time. Please, send a text-only message.");
            } else {
                sendMessage(message)
                    .then(reply => {
                        console.log(reply.text);
                        message.reply(reply.text)
                    })
                    .catch(e => {
                        console.error("Error message: ", e.cause);
                        message.reply("An error was encountered. Please try again in a moment.");
                    });
            }
        });

        whatsapp.initialize();
    })
    .catch(e => {
        console.error("Failed to connect to DB: ", e);
    });