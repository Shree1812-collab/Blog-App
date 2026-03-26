import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is mandatory"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is mandatory"],
      unique:[true,"Email already exists!"] 
    },
    password: {
      type: String,
      required: [true, "Password is mandatory"]
    },
    profileImageUrl: {
      type: String
    },
    role: {
      type: String,
      enum: ["AUTHOR", "USER", "ADMIN"],        // caps for enum
      required: [true, "{Value} is an invalid role"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false
  }
);

export const UserTypeModel = model("user", userSchema);
