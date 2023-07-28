import mongoose, { Schema, Types } from "mongoose";
import { IListEntry, IListEntryModel, IListEntryMethods } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";

const listEntrySchema = new mongoose.Schema<IListEntry, IListEntryModel, IListEntryMethods>({
  film_id:{
    type: Schema.Types.ObjectId,
    required:[true,ValidationErrorMessages.required("film_id")]
  },
  note: {
    type: String,
    required: false,
    set: (val: string): string => val.trim(),
  },
});

export default listEntrySchema;
