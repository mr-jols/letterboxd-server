/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import Comment from "../../src/models/comment";
import TestDb from "../config";
import User from "../../src/models/user/index";
import UserData from "../data/user_data";
import { IUser, IUserMethods } from "../../src/models/user/index/types";
import CommentData from "../data/comment_data";

describe("Comment model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);
  let user: HydratedDocument<IUser, IUserMethods>;
  beforeEach(async () => {
    user = await User.createUser(UserData.user1);
  });

  it("creates and validates a comment", async () => {
    await Comment.createComment(CommentData.comment1(user._id));
    expect(await Comment.findOne({ user_id: user._id })).toBeTruthy();
  });

  it("updates a comment", async () => {
    const newComment = "irma vep is really cool";
    const comment1 = await Comment.createComment(
      CommentData.comment1(user._id)
    );
    const comment2 = await Comment.createComment(
      CommentData.comment1(user._id)
    );
    const comment3 = await Comment.createComment(
      CommentData.comment1(user._id)
    );
    await comment1.updateComment({
      comment: newComment,
    });
    await comment2.updateComment({
      comment: newComment,
      is_blocked: true,
    });
    await comment3.updateComment({
      is_removed: true,
    });

    expect(comment1?.comment).toBe(newComment);
    expect(comment2?.is_removed).toBe(true);
    expect(comment2?.is_blocked).toBe(true);
    expect(comment2?.comment).toBe(".");
    expect(comment3?.comment).toBe(".");
    expect(comment3?.is_removed).toBe(true);
    expect(comment3?.is_blocked).toBe(false);
    expect(comment3?.is_edited).toBe(true);
  });

  it("deletes a comment", async () => {
    const comment = await Comment.createComment(CommentData.comment1(user._id));
    await comment.deleteComment();
    expect(await Comment.find()).toEqual([]);
  });
});
