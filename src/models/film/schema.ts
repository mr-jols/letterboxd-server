/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isValid } from "date-fns";
import { ValidationErrorMessages } from "../../utils/errors/functions";
import mongoose, { Schema } from "mongoose";
import { IFilmModel, IFilm, IFilmMethods } from "./types";
import {
  isValidCountryId,
  isValidGenreId,
  isValidLanguageId,
  isValidWatchProviderId,
} from "../../utils/functions";

const watchOptionsSchema = new mongoose.Schema({
  buy: [
    {
      type: Number,
      validate: {
        validator: (value: number): boolean => isValidWatchProviderId(value),
        message: ValidationErrorMessages.invalid(
          "watch provider id for buy option"
        ),
      },
      required: false,
    },
  ],
  rent: [
    {
      type: Number,
      validate: {
        validator: (value: number): boolean => isValidWatchProviderId(value),
        message: ValidationErrorMessages.invalid(
          "watch provider id for rent option"
        ),
      },
      required: false,
    },
  ],
  flatrate: [
    {
      type: Number,
      validate: {
        validator: (value: number): boolean => isValidWatchProviderId(value),
        message: ValidationErrorMessages.invalid(
          "watch provider id for flat rate option"
        ),
      },
      required: false,
    },
  ],
  free: [
    {
      type: Number,
      validate: {
        validator: (value: number): boolean => isValidWatchProviderId(value),
        message: ValidationErrorMessages.invalid(
          "watch provider id for free option"
        ),
      },
      required: false,
    },
  ],
});

const filmSchema = new mongoose.Schema<IFilm, IFilmModel, IFilmMethods>({
  title: {
    type: String,
    required: [true, ValidationErrorMessages.required("title")],
  },
  poster_path: {
    type: String,
    required: [true, ValidationErrorMessages.required("poster path")],
  },
  popularity: {
    type: Number,
    required: [true, ValidationErrorMessages.required("popularity")],
  },
  genre_id: [
    {
      type: Number,
      validate: {
        validator: (value: number): boolean => isValidGenreId(value),
        message: ValidationErrorMessages.invalid("genre id"),
      },
      required: [true, ValidationErrorMessages.required("genre id")],
    },
  ],
  country_id: [
    {
      type: String,
      validate: {
        validator: (value: string): boolean => isValidCountryId(value),
        message: ValidationErrorMessages.invalid("country id"),
      },
      required: [true, ValidationErrorMessages.required("country id")],
    },
  ],
  language_id: {
    type: String,
    validate: {
      validator: (value: string): boolean => isValidLanguageId(value),
      message: ValidationErrorMessages.invalid("language id"),
    },
    required: [true, ValidationErrorMessages.required("language id")],
  },
  runtime: {
    type: Number,
    required: [true, ValidationErrorMessages.required("runtime")],
  },
  release_date: {
    type: String,
    required: [true, ValidationErrorMessages.required("release date")],
    set: (val: string): string => (isValid(val) ? val : " "),
    validate: {
      validator: (val: string): boolean =>
        isValid(new Date(val)) || val === " ",
      message: ValidationErrorMessages.invalid("release date"),
    },
  },
  movie_id: {
    type: Number,
    required: [true, ValidationErrorMessages.required("Movie id")],
  },
  average_rating: {
    type: [Number],
    required: false,
    min: 11,
    max: 11,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  watch_providers: {
    type: watchOptionsSchema,
    required: false,
    default: {
      buy: [],
      rent: [],
      flatrate: [],
      free: [],
    },
  },
  is_released: {
    type: Boolean,
    default: false,
  },
  is_tv_movie: {
    type: Boolean,
    default: false,
  },
});

export default filmSchema;
