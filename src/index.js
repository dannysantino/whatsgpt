import * as dotenv from "dotenv"
dotenv.config();

import whatsappweb from "whatsapp-web.js";
import qrcode from "qrcode-terminal"
import mongoose from "mongoose";
import { MongoStore } from "wwebjs-mongo";
import { ChatGPTAPI } from "chatgpt";

import Context from "./models/Context.js";

const { Client, RemoteAuth } = whatsappweb;

const api = new ChatGPTAPI({ apiKey: process.env.API_KEY });

const sendMessage = async message => {
    let response;

    try {
        const doc = await Context.findOne();
        
        if (doc) {
            const { contextId } = doc;

            response = await api.sendMessage(message, {
                parentMessageId: contextId
            });

            await Context.findOneAndUpdate(
                { _id: doc._id },
                { contextId: response.id }
            );

            console.log("Conversation context updated");
        } else {
            response = await api.sendMessage(message);
            
            const context = new Context({
                contextId: response.id
            });

            await context.save();
        }

        return response;
        
    } catch (err) {
        throw new Error("Error Message: ", { cause: err });
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
                console.log(`Message received from: ${message.from}`);

                sendMessage(message.body)
                    .then(reply => {
                        console.log("ChatGPT reply received");
                        message.reply(reply.text);
                    })
                    .catch(e => {
                        console.error(e.message, e.cause);
                        message.reply("An error was encountered. Please try again in a moment.");
                    });
            }
        });

        whatsapp.initialize();
    })
    .catch(e => {
        console.error("Failed to connect to DB: ", e);
    });