/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import {
  IListEntry,
  IListEntryCreate,
  IListEntryDocument,
  IListEntryMethods,
  IListEntryModel,
  IListEntryNonNullableMutationResult,
  IListEntryThisContext,
  IListEntryUpdate,
} from "./types";
import listSchema from "./schema";
import { updateModel } from "../../../utils/functions";

listSchema.statics = {
  async createListEntry(
    props: IListEntryCreate
  ): IListEntryNonNullableMutationResult {
    return new ListEntry(props).save();
  },
};

listSchema.methods = {
  async updateListEntry(this, props) {
    return updateModel<
      IListEntryThisContext,
      IListEntryUpdate,
      IListEntry,
      IListEntryMethods
    >(this, {
      note: props.note ?? this.note,
    });
  },
  async deleteListEntry(this) {
    return this.deleteOne();
  },
};

const ListEntry = mongoose.model<IListEntryDocument, IListEntryModel>(
  "ListEntry",
  listSchema
);
export default ListEntry;
