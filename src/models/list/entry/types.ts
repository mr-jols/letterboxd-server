/* eslint-disable @typescript-eslint/no-empty-interface */
import { Document, HydratedDocument, Model, Types } from "mongoose";

export interface IListEntry {
  film_id: Types.ObjectId;
  note?: string;
}

export type IListEntryCreate = IListEntry;

export type IListEntryUpdate = Pick<IListEntry,"note">;

export interface IListEntryDocument extends Document, IListEntry {}

export type IListEntryThisContext = HydratedDocument<IListEntryDocument> &
  IListEntryMethods;

export interface IListEntryModel
  extends Model<IListEntryDocument, object, IListEntryMethods> {
  createListEntry(props: IListEntryCreate): IListEntryNonNullableMutationResult;
}

export interface IListEntryMethods {
  updateListEntry(
    this: IListEntryThisContext,
    props: IListEntryUpdate
  ): IListEntryMutationResult;
  deleteListEntry(this: IListEntryThisContext): IListEntryMutationResult;
}

export type IListEntryMutationResult = Promise<HydratedDocument<
  IListEntry,
  IListEntryMethods
> | null>;

export type IListEntryNonNullableMutationResult = Promise<
  HydratedDocument<IListEntry, IListEntryMethods>
>;
