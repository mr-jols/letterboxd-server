import { HydratedDocument, Model, Types, Document } from "mongoose";

export enum ActivityActions {
  joinLetterboxd = "joinLetterboxd",
  followUser = "followUser",
  addFilmToWatchlist = "addFilmToWatchlist",
  rateFilm = "rateFilm",
  logFilm = "logFilm",
  likeReview = "likeReview",
  commentOnReview = "commentOnReview",
  createList = "createList",
  likeList = "likeList",
  commentOnList = "commentOnList",
}

export interface IActivity {
  subject_id: Types.ObjectId;
  object_id: Types.ObjectId;
  action: ActivityActions;
}

export type IActivityCreate = IActivity;
export type IActivityCustomCreate = Omit<IActivity, "action">;

export interface IActivityDocument extends IActivity, Document {}

export interface IActivityMethods {
  deleteActivity(this: IActivityThisContext): IActivityMutationResult;
}

export type IActivityThisContext = HydratedDocument<
  IActivityDocument,
  IActivityMethods
>;

export interface IActivityModel
  extends Model<IActivityDocument, object, IActivityMethods> {
  createActivity(props: IActivityCreate): IActivityNonNullableMutationResult;
  createJoinLetterboxdActivity(
    props: Pick<IActivityCreate,"subject_id">
  ): IActivityMutationResult;
  createFollowUserActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  deleteFollowUserActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  createAddFilmToWatchlistActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  deleteAddFilmToWatchlistActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  createRateFilmActivity(props: IActivityCustomCreate): IActivityMutationResult;
  deleteRateFilmActivity(props: IActivityCustomCreate): IActivityMutationResult;
  createLogFilmActivity(props: IActivityCustomCreate): IActivityMutationResult;
  deleteLogFilmActivity(props: IActivityCustomCreate): IActivityMutationResult;
  createLikeReviewActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  deleteLikeReviewActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  createCommentOnReviewActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  deleteCommentOnReviewActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  createCreateListActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  deleteCreateListActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  createLikeListActivity(props: IActivityCustomCreate): IActivityMutationResult;
  deleteLikeListActivity(props: IActivityCustomCreate): IActivityMutationResult;
  createCommentOnListActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
  deleteCommentOnListActivity(
    props: IActivityCustomCreate
  ): IActivityMutationResult;
}

export type IActivityMutationResult = Promise<HydratedDocument<
  IActivity,
  IActivityMethods
> | null>;

export type IActivityNonNullableMutationResult = Promise<
  HydratedDocument<IActivity, IActivityMethods>
>;
