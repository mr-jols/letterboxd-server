import mongoose, { Schema } from "mongoose";
import { IUserEntries, IUserEntriesMethods, IUserEntriesModel } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";

const userEntriesSchema = new mongoose.Schema<
  IUserEntries,
  IUserEntriesModel,
  IUserEntriesMethods
>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, ValidationErrorMessages.required("User")],
    unique: true,
  },
  film_entry_ids: [
    {
      type: Schema.Types.ObjectId,
      ref: "FilmEntry",
    },
  ],
  diary_entry_ids: [
    {
      type: Schema.Types.ObjectId,
      ref: "DiaryEntry",
    },
  ],
});

export default userEntriesSchema;
