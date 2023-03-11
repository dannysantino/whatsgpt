import mongoose from "mongoose";

const contextSchema = new mongoose.Schema({
    contextId: {
        type: String,
        required: true
    }
});

export default mongoose.model("Context", contextSchema);