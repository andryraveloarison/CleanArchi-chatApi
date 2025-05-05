import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  online: Boolean,
  key: String
});

export default mongoose.model("User", UserSchema);
