import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, default: null },
  groupId: { type: String, default: null },
  isGroup: { type: Boolean, default: false },
  content: {
    forReceiver: { type: String, required: true },
    forSender: { type: String, required: true }
  },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  readBy: { type: [String], default: [] }
});

// ✅ Transformation pour renommer _id en id
MessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString(); // ou `String(ret._id)`
    delete ret._id;
  }
});

export default mongoose.model("Message", MessageSchema);
