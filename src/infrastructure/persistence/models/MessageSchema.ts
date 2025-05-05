import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: {
    forReceiver: { type: String, required: true },
    forSender: { type: String, required: true },
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
