import mongoose, { Schema } from "mongoose";
import { IReview, IReviewModel, IReviewMethods } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";

const reviewSchema = new mongoose.Schema<IReview, IReviewModel, IReviewMethods>(
  {
    review: {
      type: String,
      required: [true, ValidationErrorMessages.required("review")],
      set: (val: string): string => val.trim(),
    },
    contains_spoilers: {
      type: Boolean,
      default: false,
    },
    comment_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    like_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  }
);

export default reviewSchema;
