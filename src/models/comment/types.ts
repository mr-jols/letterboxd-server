/* eslint-disable @typescript-eslint/no-empty-interface */
import { Document, HydratedDocument, Model, Types } from "mongoose";

export interface IComment {
  user_id: Types.ObjectId;
  comment: string;
  is_edited: boolean;
  is_removed: boolean;
  is_blocked: boolean;
}

export type ICommentCreate = Pick<IComment, "user_id" | "comment">;
export type ICommentUpdate = Partial<Pick<
  IComment,
  "comment" | "is_removed" | "is_blocked"
>>;

export interface ICommentDocument extends IComment, Document {}

export interface ICommentMethods {
  updateComment(
    this: ICommentThisContext,
    props: ICommentUpdate
  ): ICommentMutationResult;
  deleteComment(
    this: ICommentThisContext
  ): ICommentMutationResult;
}

export type ICommentThisContext = HydratedDocument<
  ICommentDocument,
  ICommentMethods
>;

export interface ICommentModel
  extends Model<ICommentDocument, object, ICommentMethods> {
  createComment(
    props: ICommentCreate
  ): Promise<HydratedDocument<IComment, ICommentMethods>>;
}

export type ICommentMutationResult = Promise<HydratedDocument<
  IComment,
  ICommentMethods
> | null>;
