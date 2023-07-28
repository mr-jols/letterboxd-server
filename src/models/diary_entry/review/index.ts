/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import {
  IReview,
  IReviewCreate,
  IReviewDocument,
  IReviewMethods,
  IReviewModel,
  IReviewMutationResult,
  IReviewThisContext,
  IReviewUpdate,
} from "./types";
import reviewSchema from "./schema";
import { updateModel } from "../../../utils/functions";
import Comment from "../../comment";
import Activity from "../../activity";

reviewSchema.statics = {
  async createReview(props: IReviewCreate): IReviewMutationResult {
    return new Review({ ...props, like_ids: [], comment_ids: [] }).save();
  },
};

reviewSchema.methods = {
  async updateReview(this, props) {
    return updateModel<
      IReviewThisContext,
      IReviewCreate,
      IReview,
      IReviewMethods
    >(this, {
      review: props.review ?? this.review,
      contains_spoilers: props.contains_spoilers ?? this.contains_spoilers,
    });
  },
  async addComment(this, comment) {
    await Activity.createCommentOnReviewActivity({
      subject_id:comment.user_id,
      object_id:this._id
    });
    const createdComment = await Comment.createComment(comment);
    return updateModel<
      IReviewThisContext,
      IReviewUpdate,
      IReview,
      IReviewMethods
    >(this, {
      comment_ids: this.comment_ids.concat(createdComment._id),
    });
  },
  async removeComment(this, comment_id) {
    const comment = await Comment.findById(comment_id);
    if (!comment) return null;
    await Activity.deleteCommentOnReviewActivity({
      subject_id:comment.user_id,
      object_id:this._id
    });
    const deletedComment = await comment.deleteComment();
    if (!deletedComment) return deletedComment;
    return updateModel<
      IReviewThisContext,
      IReviewUpdate,
      IReview,
      IReviewMethods
    >(this, {
      comment_ids: this.comment_ids.filter(
        (item) => !item._id.equals(deletedComment._id)
      ),
    });
  },
  async addLike(this, userId) {
    await Activity.createLikeReviewActivity({
      subject_id:userId,
      object_id:this._id
    });
    return updateModel<
      IReviewThisContext,
      IReviewUpdate,
      IReview,
      IReviewMethods
    >(this, {
      like_ids: this.like_ids.concat(userId),
    });
  },
  async removeLike(this, userId) {
    await Activity.deleteLikeReviewActivity({
      subject_id:userId,
      object_id:this._id
    });
    return updateModel<
      IReviewThisContext,
      IReviewUpdate,
      IReview,
      IReviewMethods
    >(this, {
      like_ids: this.comment_ids.filter((item) => !item._id.equals(userId)),
    });
  },
  async deleteReview(this) {
    return this.deleteOne();
  },
};

const Review = mongoose.model<IReviewDocument, IReviewModel>(
  "Review",
  reviewSchema
);
export default Review;
