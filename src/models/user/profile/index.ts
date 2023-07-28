/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose, { Types } from "mongoose";
import userProfileSchema from "./schema";
import {
  IUserProfile,
  IUserProfileCreate,
  IUserProfileDocument,
  IUserProfileMethods,
  IUserProfileModel,
  IUserProfileNonNullableMutationResult,
  IUserProfileThisContext,
  IUserProfileUpdate,
} from "./types";
import { updateModel } from "../../../utils/functions";
import User from "../index";
import { InternalServerError } from "../../../utils/errors/errors";

userProfileSchema.statics = {
  async createUserProfile(
    user_id: IUserProfileCreate
  ): IUserProfileNonNullableMutationResult {
    const user = await User.findById(user_id);
    if (!user)
      throw new InternalServerError(
        "User not found while creating user profile"
      );
    return new UserProfile({
      user_id,
      email: user.email,
    }).save();
  },
};

userProfileSchema.methods = {
  async readUserProfile(this) {
    const user = await User.findById(this.user_id);
    if (!user)
      throw new InternalServerError(
        "User not found attempting to read user profile"
      );
    return {
      profile_id: this._id,
      user_id: this.user_id,
      username: user.username,
      avi: this.avi,
      bio: this.bio,
      email: this.email,
      family_name: this.family_name,
      given_name: this.given_name,
      location: this.location,
      pronoun: this.pronoun,
      twitter: this.twitter,
      website: this.website,
    };
  },
  async updateUserProfile(this, props: Partial<IUserProfileUpdate>) {
    if (props.email) {
      await User.findByIdAndUpdate(this.user_id, { email: props.email });
    }
    return updateModel<
      IUserProfileThisContext,
      IUserProfileUpdate,
      IUserProfile,
      IUserProfileMethods
    >(this, {
      given_name: props.given_name ?? this.given_name,
      family_name: props.family_name ?? this.family_name,
      bio: props.bio ?? this.bio,
      email: props.email ?? this.email,
      location: props.location ?? this.location,
      pronoun: props.pronoun ?? this.pronoun,
      website: props.website ?? this.website,
      avi: props.avi ?? this.avi,
      twitter: props.twitter ?? this.twitter,
    });
  },
  async deleteUserProfile(this) {
    return this.deleteOne();
  },
};

const UserProfile = mongoose.model<IUserProfileDocument, IUserProfileModel>(
  "UserProfile",
  userProfileSchema
);
export default UserProfile;
