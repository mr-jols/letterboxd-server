import mongoose, { Schema } from "mongoose";
import { IUserLists, IUserListsMethods, IUserListsModel } from "./types";
import { ValidationErrorMessages } from "../../../utils/errors/functions";

const userListsSchema = new mongoose.Schema<
  IUserLists,
  IUserListsModel,
  IUserListsMethods
>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, ValidationErrorMessages.required("User")],
    unique: true,
  },
  list_ids: [
    {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

export default userListsSchema;
