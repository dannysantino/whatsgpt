import mongoose from "mongoose";

const contextSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    parentMessageId: {
        type: String,
        required: true
    }
});

export default mongoose.model("Context", contextSchema);