/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import {
  IList,
  IListCreate,
  IListDocument,
  IListMethods,
  IListModel,
  IListNonNullableMutationResult,
  IListThisContext,
  IListUpdate,
} from "./types";
import listSchema from "./schema";
import { updateModel } from "../../../utils/functions";
import Comment from "../../comment";
import Activity from "../../activity";

listSchema.statics = {
  async createList(props: IListCreate): IListNonNullableMutationResult {
    return new List({
      ...props.props,
      list_entries: props.listEntries,
      tags: Array.from(new Set(props.props.tags)),
    }).save();
  },
};

listSchema.methods = {
  async updateList(this, props) {
    return updateModel<IListThisContext, IListUpdate, IList, IListMethods>(
      this,
      {
        description: props.description ?? this.description,
        is_private: props.is_private ?? this.is_private,
        is_ranked: props.is_ranked ?? this.is_ranked,
        list_entries: props.list_entries ?? this.list_entries,
        tags: Array.from(new Set(props.tags)) ?? this.tags,
      }
    );
  },
  async addComment(this, comment) {
    await Activity.createCommentOnListActivity({
      subject_id: comment.user_id,
      object_id: this._id,
    });
    const createdComment = await Comment.createComment(comment);
    return updateModel<
      IListThisContext,
      Pick<IList, "comment_ids">,
      IList,
      IListMethods
    >(this, {
      comment_ids: this.comment_ids.concat(createdComment._id),
    });
  },
  async removeComment(this, comment_id) {
    const comment = await Comment.findById(comment_id);
    if (!comment) return null;
    await Activity.deleteCommentOnListActivity({
      subject_id: comment.user_id,
      object_id: this._id,
    });
    const deletedComment = await comment.deleteComment();
    if (!deletedComment) return deletedComment;
    return updateModel<
      IListThisContext,
      Pick<IList, "comment_ids">,
      IList,
      IListMethods
    >(this, {
      comment_ids: this.comment_ids.filter(
        (item) => !item._id.equals(deletedComment._id)
      ),
    });
  },
  async addLike(this, userId) {
    await Activity.createLikeListActivity({
      subject_id: userId,
      object_id: this._id,
    });
    return updateModel<
      IListThisContext,
      Pick<IList, "like_ids">,
      IList,
      IListMethods
    >(this, {
      like_ids: this.like_ids.concat(userId),
    });
  },
  async removeLike(this, userId) {
    await Activity.deleteLikeListActivity({
      subject_id: userId,
      object_id: this._id,
    });
    return updateModel<
      IListThisContext,
      Pick<IList, "like_ids">,
      IList,
      IListMethods
    >(this, {
      like_ids: this.comment_ids.filter((item) => !item._id.equals(userId)),
    });
  },
  async deleteList(this) {
    return this.deleteOne();
  },
};

const List = mongoose.model<IListDocument, IListModel>("List", listSchema);
export default List;
