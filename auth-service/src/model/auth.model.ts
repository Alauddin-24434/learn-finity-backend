import { model, Schema} from "mongoose";
import { IUser } from "../interfaces/auth.interfaces";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  role: {
    type: [String],
    enum: ["student", "instructor", "admin"], // Roles can be multiple
    default: ["student"], // Default to student role
    required: true,
  },
  courseEnrollments: { type: [String], default: [] }, 
}, { timestamps: true ,versionKey:false});

const User = model<IUser>("User", userSchema);

export default User;