import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
