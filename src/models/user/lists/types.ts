import { Document, HydratedDocument, Model, Types } from "mongoose";
import { IList, IListMethods, IListMutationResult } from "../../list/index/types";

export interface IUserLists {
  user_id: Types.ObjectId;
  list_ids: Types.ObjectId[];
}

export type IUserListsCreate = Types.ObjectId;

export type IUserListsUpdate = Pick<IUserLists, "list_ids">;

export interface IUserListsDocument extends IUserLists, Document {}

export interface IUserListsMethods {
  addList(
    this: IUserListsThisContext,
    list: HydratedDocument<IList,IListMethods>
  ): IUserListsMutationResult;
  removeList(
    this: IUserListsThisContext,
    list: HydratedDocument<IList,IListMethods>
  ): IListMutationResult;
  deleteUserLists(this: IUserListsThisContext): IUserListsMutationResult;
}

export type IUserListsThisContext = HydratedDocument<IUserLists> &
  IUserListsMethods;

export interface IUserListsModel
  extends Model<IUserListsDocument, object, IUserListsMethods> {
  createUserLists(props: IUserListsCreate): IUserListsNonNullableMutationResult;
}

export type IUserListsMutationResult = Promise<HydratedDocument<
  IUserLists,
  IUserListsMethods
> | null>;

export type IUserListsNonNullableMutationResult = Promise<
  HydratedDocument<IUserLists, IUserListsMethods>
>;
