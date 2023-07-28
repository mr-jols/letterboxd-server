/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import {
  ActivityActions,
  IActivityCreate,
  IActivityCustomCreate,
  IActivityDocument,
  IActivityModel,
  IActivityMutationResult,
  IActivityNonNullableMutationResult,
} from "./types";
import activitySchema from "./schema";

activitySchema.statics = {
  async createActivity(
    props: IActivityCreate
  ): IActivityNonNullableMutationResult {
    return new Activity(props).save();
  },
  async createJoinLetterboxdActivity({
    subject_id,
  }:Pick<IActivityCreate,"subject_id">): IActivityMutationResult {
    if (
      await Activity.findOne({
        $and: [
          { subject_id },
          { action: ActivityActions.joinLetterboxd },
        ],
      })
    )
      return null;
    return Activity.createActivity({
      action: ActivityActions.joinLetterboxd,
      subject_id,
      object_id:subject_id,
    });
  },
  async createFollowUserActivity({
    object_id,
    subject_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    if (
      await Activity.findOne({
        $and: [
          { object_id },
          { subject_id },
          { action: ActivityActions.followUser },
        ],
      })
    )
      return null;
    return Activity.createActivity({
      action: ActivityActions.followUser,
      subject_id,
      object_id,
    });
  },
  async deleteFollowUserActivity({
    object_id,
    subject_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.followUser },
      ],
    });
  },
  async createAddFilmToWatchlistActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteOne({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.addFilmToWatchlist },
      ],
    });
    return Activity.createActivity({
      action: ActivityActions.addFilmToWatchlist,
      subject_id,
      object_id,
    });
  },
  async deleteAddFilmToWatchlistActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.addFilmToWatchlist },
      ],
    });
  },
  async createRateFilmActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteRateFilmActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.rateFilm,
      subject_id,
      object_id,
    });
  },
  async deleteRateFilmActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.rateFilm },
      ],
    });
  },
  async createLogFilmActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteLogFilmActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.logFilm,
      subject_id,
      object_id,
    });
  },
  async deleteLogFilmActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.logFilm },
      ],
    });
  },
  async createLikeReviewActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteLikeReviewActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.likeReview,
      subject_id,
      object_id,
    });
  },
  async deleteLikeReviewActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.likeReview },
      ],
    });
  },
  async createCommentOnReviewActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteCommentOnReviewActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.commentOnReview,
      subject_id,
      object_id,
    });
  },
  async deleteCommentOnReviewActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.commentOnReview },
      ],
    });
  },
  async createCreateListActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteCreateListActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.createList,
      subject_id,
      object_id,
    });
  },
  async deleteCreateListActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.createList },
      ],
    });
  },
  async createLikeListActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteLikeListActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.likeList,
      subject_id,
      object_id,
    });
  },
  async deleteLikeListActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.likeList },
      ],
    });
  },
  async createCommentOnListActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    await Activity.deleteCommentOnListActivity({ subject_id, object_id });
    return Activity.createActivity({
      action: ActivityActions.commentOnList,
      subject_id,
      object_id,
    });
  },
  async deleteCommentOnListActivity({
    subject_id,
    object_id,
  }: IActivityCustomCreate): IActivityMutationResult {
    return Activity.findOneAndDelete({
      $and: [
        { object_id },
        { subject_id },
        { action: ActivityActions.commentOnList },
      ],
    });
  },
};

activitySchema.methods = {
  async deleteActivity(this) {
    return this.deleteOne();
  },
};

const Activity = mongoose.model<IActivityDocument, IActivityModel>(
  "Activity",
  activitySchema
);

export default Activity;
