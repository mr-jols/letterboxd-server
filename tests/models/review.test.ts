/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import Review from "../../src/models/diary_entry/review";
import TestDb from "../config";
import ReviewData from "../data/review_data";
import { IUser, IUserMethods } from "../../src/models/user/index/types";
import User from "../../src/models/user/index";
import UserData from "../data/user_data";
import CommentData from "../data/comment_data";
import Activity from "../../src/models/activity";
import { ActivityActions } from "../../src/models/activity/types";

describe("Review model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  let user: HydratedDocument<IUser, IUserMethods>;
  beforeEach(async () => {
    user = await User.createUser(UserData.user1);
  });

  it("creates and validates a review ", async () => {
    const review = await Review.createReview(ReviewData.review1);
    expect(await Review.findById(review._id)).toBeTruthy();
  });

  it("updates primary review attributes", async () => {
    const newReview = "empty review, says nothing";
    const review = await Review.createReview(ReviewData.review1);
    await review.updateReview({
      review: newReview,
      contains_spoilers: !ReviewData.review1,
    });
    expect(review?.review).toBe(newReview);
    expect(review?.contains_spoilers).toBe(!ReviewData.review1);
  });

  it("updates review comments", async () => {
    const review = await Review.createReview(ReviewData.review1);
    await review.addComment(CommentData.comment1(user._id));
    expect(review?.comment_ids.length).toBe(1);
    await review.removeComment(review!.comment_ids[0]._id);
    expect(review?.comment_ids.length).toBe(0);
  });

  it("updates review likes", async () => {
    const review = await Review.createReview(ReviewData.review1);
    await review.addLike(user._id);
    expect(review?.like_ids.length).toBe(1);
    await review.removeLike(user._id);
    expect(review?.like_ids.length).toBe(0);
  });

  it("deletes a review likes", async () => {
    const review = await Review.createReview(ReviewData.review1);
    await review.deleteReview();
    expect(await Review.find()).toEqual([]);
  });

  it("updates review comments activity", async () => {
    const review = await Review.createReview(ReviewData.review1);
    await review.addComment(CommentData.comment1(user._id));
    expect(
      (await Activity.findOne({ subject_id: user._id, object_id: review._id }))
        ?.action
    ).toBe(ActivityActions.commentOnReview);
    await review.removeComment(review!.comment_ids[0]._id);
    expect(
      (await Activity.findOne({ subject_id: user._id, object_id: review._id }))
    ).toBe(null);
  });

  it("updates review likes activity", async () => {
    const review = await Review.createReview(ReviewData.review1);
    await review.addLike(user._id);
    expect(
      (await Activity.findOne({ subject_id: user._id, object_id: review._id }))
        ?.action
    ).toBe(ActivityActions.likeReview);
    await review.removeLike(user._id);
    expect(
      (await Activity.findOne({ subject_id: user._id, object_id: review._id }))
    ).toBe(null);
  });
});
