import mongoose, { Schema } from "mongoose";
import {
  ActivityActions,
  IActivity,
  IActivityMethods,
  IActivityModel,
} from "./types";
import { ValidationErrorMessages } from "../../utils/errors/functions";

const activitySchema = new mongoose.Schema<
  IActivity,
  IActivityModel,
  IActivityMethods
>(
  {
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,ValidationErrorMessages.required("subject id")],
    },
    object_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,ValidationErrorMessages.required("object id")],
    },
    action: {
      type: String,
      enum: ActivityActions,
    },
  },
  { timestamps: true }
);

export default activitySchema;
