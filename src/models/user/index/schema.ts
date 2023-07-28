import mongoose from "mongoose";
import { IUser, IUserMethods, IUserModel } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";
import { isEmail } from "../../../utils/functions";

const userSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
  {
    username: {
      type: mongoose.Schema.Types.String,
      minlength: [1, ValidationErrorMessages.tooShort("username")],
      maxlength: [15, ValidationErrorMessages.tooLong("username")],
      required: [true, ValidationErrorMessages.required("username")],
      lowercase: true,
      unique: true,
      validate: {
        validator: (value: string): boolean =>
          /^[a-zA-Z_]\w{0,14}$/.test(value),
        message: ValidationErrorMessages.invalid("username"),
      },
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: [true, ValidationErrorMessages.required("email")],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => isEmail(value),
        message: ValidationErrorMessages.invalid("email"),
      },
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: [true, ValidationErrorMessages.required("password")],
      minlength: [6, ValidationErrorMessages.tooShort("password")],
      maxlength: [32, ValidationErrorMessages.tooLong("password")],
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blocklist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default userSchema;
