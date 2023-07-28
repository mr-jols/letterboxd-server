import mongoose, { Schema } from "mongoose";
import { IComment, ICommentMethods, ICommentModel } from "./types";
import { ValidationErrorMessages } from "../../utils/errors/functions";

const commentSchema = new mongoose.Schema<
  IComment,
  ICommentModel,
  ICommentMethods
>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: [true,ValidationErrorMessages.required("comment")],
      set: (val: string): string => val?.trim(),
    },
    is_edited: {
      type: Boolean,
      default: false,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    is_removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default commentSchema;
