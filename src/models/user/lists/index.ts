/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import userListsSchema from "./schema";
import {
  IUserLists,
  IUserListsCreate,
  IUserListsDocument,
  IUserListsMethods,
  IUserListsModel,
  IUserListsNonNullableMutationResult,
  IUserListsThisContext,
  IUserListsUpdate,
} from "./types";
import { updateModel } from "../../../utils/functions";
import List from "../../list/index";
import Activity from "../../activity";

userListsSchema.statics = {
  async createUserLists(
    user_id: IUserListsCreate
  ): IUserListsNonNullableMutationResult {
    return new UserLists({ user_id }).save();
  },
};

userListsSchema.methods = {
  async deleteUserLists(this) {
    await Activity.deleteMany({
        subject_id: this.user_id,
        object_id: { $in: this.list_ids },
      });
    await List.deleteMany({_id:{$in:this.list_ids}});
    return this.deleteOne();
  },
  async addList(this, list) {
    if (this.list_ids.includes(list._id)) return null;
    await Activity.createCreateListActivity({
        subject_id:this.user_id,
        object_id:list._id
    });
    return updateModel<
      IUserListsThisContext,
      IUserListsUpdate,
      IUserLists,
      IUserListsMethods
    >(this, {
      list_ids: this.list_ids.concat(list._id),
    });
  },
  async removeList(this, list) {
    if (!this.list_ids.includes(list._id)) return null;
    await Activity.deleteCreateListActivity({
        subject_id:this.user_id,
        object_id:list._id
    });
    updateModel<
      IUserListsThisContext,
      IUserListsUpdate,
      IUserLists,
      IUserListsMethods
    >(this, {
      list_ids: this.list_ids.filter((item) => !item._id.equals(list._id)),
    });
    return list.deleteList();
  },
};

const UserLists = mongoose.model<IUserListsDocument, IUserListsModel>(
  "UserLIUserLists",
  userListsSchema
);
export default UserLists;
