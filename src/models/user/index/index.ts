/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-invalid-this */
import mongoose from "mongoose";
import bcryt from "bcrypt";
import userSchema from "./schema";
import {
  IUserCreate,
  IUserDocument,
  IUserModel,
  IUserThisContext,
} from "./types";
import Activity from "../../activity";
import UserProfile from "../profile";
import { InternalServerError } from "../../../utils/errors/errors";

userSchema.pre("save", function (this: IUserThisContext, next: any) {
  if (!this.isModified("password")) return next();
  this.password = bcryt.hashSync(this.password, 10);
  next();
});

userSchema.statics = {
  async createUser(props: IUserCreate) {
    return new User(props).save();
  },
};

userSchema.methods = {
  async initialize(this) {
    await Activity.createJoinLetterboxdActivity({
      subject_id: this._id,
    });
    await UserProfile.createUserProfile(this._id);
  },
  async readUser(this) {
    const userProfile = await UserProfile.findOne({ user_id: this._id });
    const readUserProfile = await userProfile?.readUserProfile();

    if (!readUserProfile)
      throw new InternalServerError("User profile not found reading user");
    return {
      profile: readUserProfile,
    };
  },
  authenticate(this, password) {
    return bcryt.compareSync(password, this.password);
  },
  async follow(this, user) {
    if (!this.canUserBeInteractedWith(user._id)) return null;
    if (this.following.includes(user._id)) return null;
    await Activity.createFollowUserActivity({
      subject_id: this._id,
      object_id: user._id,
    });
    this.following.push(user._id);
    user.followers.push(this._id);
    await user.save({ validateModifiedOnly: true });
    return this.save({ validateModifiedOnly: true });
  },
  async unfollow(this, user) {
    if (!this.following.includes(user._id)) return null;
    if (!this.canUserBeInteractedWith(user._id)) return null;
    this.following.splice(this.following.indexOf(user._id), 1);
    user.followers.splice(user.followers.indexOf(this._id), 1);
    user.save({ validateModifiedOnly: true });
    return this.save({ validateModifiedOnly: true });
  },
  async block(this, user) {
    if (!this.canUserBeInteractedWith(user._id)) return null;
    await this.unfollow(user);
    await user.unfollow(this);
    this.blocklist.push(user._id);
    return this.save({ validateModifiedOnly: true });
  },
  async unblock(this, user) {
    if (!this.blocklist.includes(user._id)) return null;
    this.blocklist.splice(this.blocklist.indexOf(user._id), 1);
    return this.save({ validateModifiedOnly: true });
  },
  canUserBeInteractedWith(this, user_id) {
    if (this._id.equals(user_id)) return false;
    if (this.blocklist.includes(user_id)) return false;
    return true;
  },
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export default User;
