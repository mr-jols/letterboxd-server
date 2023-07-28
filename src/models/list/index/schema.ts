import mongoose, { Schema, Types } from "mongoose";
import { IList, IListModel, IListMethods } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";
import listEntrySchema from "../entry/schema";
import { IListEntry } from "../entry/types";

const listSchema = new mongoose.Schema<IList, IListModel, IListMethods>({
  title: {
    type: String,
    required: [true, ValidationErrorMessages.required("title")],
  },
  description: {
    type: String,
    required: false,
  },
  list_entries: {
    type: [
     listEntrySchema
    ],
    required: [true, ValidationErrorMessages.required("list entries")],
    validate: {
      validator(array: IListEntry[]): boolean {
        const isFilmDuplicated=array.length !== new Set(array.map(item=>item.film_id)).size;
        return array && array.length > 0 && !isFilmDuplicated;
      },
      message: ValidationErrorMessages.invalid("list entries"),
    },
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
      ref: "User",
    },
  ],
  tags: [String],
  is_private: {
    type: Boolean,
    default: false,
  },
  is_ranked: {
    type: Boolean,
    default: false,
  },
});

export default listSchema;
