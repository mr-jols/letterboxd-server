import mongoose, { Schema } from "mongoose";
import { IDiaryEntry, IDiaryEntryModel, IDiaryEntryMethods } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";
import { formatDate } from "../../../utils/functions";
import { isValid } from "date-fns";

const diaryEntrySchema = new mongoose.Schema<
  IDiaryEntry,
  IDiaryEntryModel,
  IDiaryEntryMethods
>(
  {
    film_entry_id: {
      type: Schema.Types.ObjectId,
      ref: "FilmEntry",
      required: [true, ValidationErrorMessages.required("film entry id")],
    },
    review_id: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: false,
    },
    rating: {
      type: Number,
      min: [0, ValidationErrorMessages.tooShort("rating")],
      max: [10, ValidationErrorMessages.tooLong("rating")],
      required: [true, ValidationErrorMessages.required("rating")],
    },
    is_a_rewatch: {
      type: Boolean,
      required: false,
    },
    date: {
      type: String,
      required: false,
      default: formatDate(new Date(Date.now())),
      set: (val: Date): string => formatDate(new Date(val ?? Date.now())),
      validate: {
        validator: (val: string): boolean => isValid(new Date(val)),
        message: ValidationErrorMessages.invalid("diary date"),
      },
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default diaryEntrySchema;
