import{ Document, HydratedDocument, Model, Types } from "mongoose";
import { ICommentCreate } from "../../comment/types";

export interface IReview {
  review: string;
  contains_spoilers: boolean;
  like_ids: Types.ObjectId[];
  comment_ids: Types.ObjectId[];
}

export type IReviewCreate = Pick<IReview, "review" | "contains_spoilers">;
export type IReviewUpdate = Partial<IReview>;

export interface IReviewDocument extends Document, IReview {}

export type IReviewThisContext = HydratedDocument<IReviewDocument> &
  IReviewMethods;

export interface IReviewModel
  extends Model<IReviewDocument, object, IReviewMethods> {
  createReview(props: IReviewCreate): IReviewNonNullMutationResult;
}

export interface IReviewMethods {
  updateReview(
    this: IReviewThisContext,
    props: IReviewCreate
  ): IReviewMutationResult;
  addLike(
    this: IReviewThisContext,
    user_id: Types.ObjectId
  ): IReviewMutationResult;
  removeLike(
    this: IReviewThisContext,
    user_id: Types.ObjectId
  ): IReviewMutationResult;
  addComment(
    this: IReviewThisContext,
    comment: ICommentCreate
  ): IReviewMutationResult;
  removeComment(
    this: IReviewThisContext,
    comment: Types.ObjectId
  ): IReviewMutationResult;
  deleteReview(this: IReviewThisContext): IReviewMutationResult;
}

export type IReviewMutationResult = Promise<HydratedDocument<
  IReview,
  IReviewMethods
> | null>;

export type IReviewNonNullMutationResult = Promise<
  HydratedDocument<IReview, IReviewMethods>
>;
