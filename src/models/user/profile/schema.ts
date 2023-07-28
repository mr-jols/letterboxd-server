import mongoose, { Schema } from "mongoose";
import { IUserLists } from "../lists/types";
import { IUserProfile, IUserProfileMethods, IUserProfileModel, UserPronoun } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";
import { isEmail } from "../../../utils/functions";

const userProfileSchema = new mongoose.Schema<
  IUserProfile,
  IUserProfileModel,
  IUserProfileMethods
>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, ValidationErrorMessages.required("User")],
    unique: true,
  },
  given_name: {
    type: Schema.Types.String,
    default: null
  },
  family_name: {
    type: Schema.Types.String,
    default: null
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
  location: {
    type: Schema.Types.String,
    default: null
  },
  website: {
    type: Schema.Types.String,
    default: null
  },
  bio: {
    type: Schema.Types.String,
    trim: true,
    default: null
  },
  pronoun: {
    type: Schema.Types.String,
    enum: UserPronoun,
    default: UserPronoun.THEY_THEIR,
  },
  avi:{
    type:Schema.Types.String,
    default: null
  },
  twitter:{
    type:Schema.Types.String,
    default: null
  }
});

export default userProfileSchema;
