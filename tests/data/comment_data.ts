/* eslint-disable lines-between-class-members */
import { Types } from "mongoose";
import { ICommentCreate } from "../../src/models/comment/types";

class CommentData {
  public static comment1 = (user_id: Types.ObjectId): ICommentCreate => ({
    user_id,
    comment: "irma vep sucks",
  });
  public static comment2 = (user_id: Types.ObjectId): ICommentCreate => ({
    user_id,
    comment: "irma vep rocks",
  });
}

export default CommentData;
