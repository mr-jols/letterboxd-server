/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ValidationErrorMessages } from "../../utils/errors/functions";
import mongoose, { Schema } from "mongoose";
import { IFilmEntryModel, IFilmEntry, IFilmEntryMethods } from "./types";

const filmEntrySchema = new mongoose.Schema<
  IFilmEntry,
  IFilmEntryModel,
  IFilmEntryMethods
>({
  film_id: {
    type: Schema.Types.ObjectId,
    ref: "Film",
    required: [true, ValidationErrorMessages.required("film_id")],
  },
  rating: {
    type: Number,
    min: [0, ValidationErrorMessages.tooShort("rating")],
    max: [10, ValidationErrorMessages.tooLong("rating")],
    default: 0,
  },
  is_watched: {
    type: Boolean,
    default: false,
  },
  is_logged: {
    type: Boolean,
    default: false,
  },
  is_liked: {
    type: Boolean,
    default: false,
  },
  is_in_watchlist: {
    type: Boolean,
    default: false,
  },
  is_reviewed: {
    type: Boolean,
    default: false,
  },
  is_favourited: {
    type: Boolean,
    default: false,
  },
});

export default filmEntrySchema;
