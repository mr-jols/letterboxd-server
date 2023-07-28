/* eslint-disable @typescript-eslint/no-empty-interface */
import { Document, HydratedDocument, Model, Types } from "mongoose";
import { ICommentCreate } from "../../comment/types";
import { IListEntry, IListEntryCreate } from "../entry/types";

export interface IList {
  title: string;
  description?: string;
  list_entries:IListEntry[];
  like_ids: Types.ObjectId[];
  comment_ids: Types.ObjectId[];
  is_private: boolean;
  is_ranked: boolean;
  tags: string[];
}

export interface IListCreate {
  listEntries:IListEntryCreate[];
  props: Pick<
    IList,
    "title" | "description" | "is_ranked" | "tags" | "is_private"
  >;
}
export type IListUpdate = Partial<
  Omit<IList,"like_ids" | "comment_ids" | "title">
>;

export interface IListDocument extends Document, IList {}

export type IListThisContext = HydratedDocument<IListDocument> & IListMethods;

export interface IListModel extends Model<IListDocument, object, IListMethods> {
  createList(props: IListCreate): IListNonNullableMutationResult;
}

export interface IListMethods {
    updateList(
        this: IListThisContext,
        props: IListUpdate
      ): IListMutationResult;
      addLike(
        this: IListThisContext,
        user_id: Types.ObjectId
      ): IListMutationResult;
      removeLike(
        this: IListThisContext,
        user_id: Types.ObjectId
      ): IListMutationResult;
      addComment(
        this: IListThisContext,
        comment: ICommentCreate
      ): IListMutationResult;
      removeComment(
        this: IListThisContext,
        comment: Types.ObjectId
      ): IListMutationResult;
      deleteList(this: IListThisContext): IListMutationResult;
}

export type IListMutationResult = Promise<HydratedDocument<
  IList,
  IListMethods
> | null>;

export type IListNonNullableMutationResult = Promise<
  HydratedDocument<IList, IListMethods>
>;
