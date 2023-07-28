/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import {
  IComment,
  ICommentCreate,
  ICommentDocument,
  ICommentMethods,
  ICommentModel,
  ICommentThisContext,
  ICommentUpdate,
} from "./types";
import commentSchema from "./schema";
import { updateModel } from "../../utils/functions";

commentSchema.statics = {
  async createComment(props: ICommentCreate) {
    return new Comment(props).save();
  },
};

commentSchema.methods = {
  async updateComment(this, props) {
    const isVoid = Boolean(props.is_blocked) || Boolean(props.is_removed);
    if (props.is_blocked) this.is_removed = true;
    if (props.comment && props.comment !== this.comment || isVoid)
      this.is_edited = true;
    return updateModel<
      ICommentThisContext,
      ICommentUpdate,
      IComment,
      ICommentMethods
    >(this, {
      comment: isVoid ? "." : props.comment ?? this.comment,
      is_removed: props.is_removed ?? this.is_removed,
      is_blocked: props.is_blocked ?? this.is_blocked,
    });
  },
  async deleteComment() {
    return this.deleteOne();
  },
};

const Comment = mongoose.model<ICommentDocument, ICommentModel>(
  "Comment",
  commentSchema
);

export default Comment;
