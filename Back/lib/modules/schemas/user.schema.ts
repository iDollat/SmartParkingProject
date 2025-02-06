import { Schema, model } from "mongoose";
import { IUser } from "../models/user.model";

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isAdmin: { type: Boolean, default: true },
});

export default model<IUser>("users", UserSchema);
