import { Document, HydratedDocument, Model, Types } from "mongoose";
import { IUser } from "../index/types";

export interface IUserProfile {
  user_id: Types.ObjectId;
  given_name?: string;
  family_name?: string;
  email?: string;
  location?: string;
  website?: string;
  bio?: string;
  pronoun?: UserPronoun;
  avi?: string;
  twitter?: string;
}

export enum UserPronoun {
  THEY_THEIR = "They / their",
  HE_HIS = "He / his",
  HE_THEIR = "He / their",
  SHE_HER = "She / her",
  SHE_THEIR = "She / their",
  XE_XYR = "Xe / xyr",
  ZE_HIR = "Ze / hir",
  ZE_ZIR = "Ze / zir",
  IT_ITS = "It / its",
}

export type IUserProfileCreate = Types.ObjectId;

export type IUserProfileUpdate = Omit<IUserProfile, "user_id">;

export interface IUserProfileDocument extends IUserProfile, Document {}

export type IUserProfileRead = IUserProfile &
  Pick<IUser, "username"> & { profile_id: Types.ObjectId };

export interface IUserProfileMethods {
  readUserProfile(this: IUserProfileThisContext): Promise<IUserProfileRead>;
  updateUserProfile(
    this: IUserProfileThisContext,
    props: IUserProfileUpdate
  ): IUserProfileMutationResult;
  deleteUserProfile(
    this: IUserProfileThisContext
  ): IUserProfileNonNullableMutationResult;
}

export type IUserProfileThisContext = HydratedDocument<IUserProfile> &
  IUserProfileMethods;

export interface IUserProfileModel
  extends Model<IUserProfileDocument, object, IUserProfileMethods> {
  createUserProfile(
    props: IUserProfileCreate
  ): IUserProfileNonNullableMutationResult;
}

export type IUserProfileMutationResult = Promise<HydratedDocument<
  IUserProfile,
  IUserProfileMethods
> | null>;

export type IUserProfileNonNullableMutationResult = Promise<
  HydratedDocument<IUserProfile, IUserProfileMethods>
>;
