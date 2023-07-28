import { Document, HydratedDocument, Model, Types } from "mongoose";
import { IUserProfile, IUserProfileRead } from "../profile/types";

export interface IUser {
  username: string;
  email: string;
  password: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  blocklist: Types.ObjectId[];
}

interface IUserRead{
  profile: IUserProfileRead;
}

export type IUserCreate = Pick<IUser, "username" | "email" | "password">;


export interface IUserDocument extends IUser, Document {}

export interface IUserMethods {
  initialize(this: IUserThisContext): Promise<void>;
  readUser(this: IUserThisContext): Promise<IUserRead>;
  authenticate(this: IUserThisContext, password: string): boolean;
  follow(
    this: IUserThisContext,
    user: HydratedDocument<IUserDocument, IUserDocument>
  ): IUserMutationResult;
  unfollow(
    this: IUserThisContext,
    user: HydratedDocument<IUserDocument, IUserMethods>
  ): IUserMutationResult;
  block(
    this: IUserThisContext,
    user: HydratedDocument<IUserDocument, IUserMethods>
  ): IUserMutationResult;
  unblock(
    this: IUserThisContext,
    user: HydratedDocument<IUserDocument, IUserMethods>
  ): IUserMutationResult;
  canUserBeInteractedWith(
    this: IUserThisContext,
    user_id: Types.ObjectId
  ): boolean;
}

export type IUserThisContext = HydratedDocument<IUserDocument, IUserMethods>;

export interface IUserModel extends Model<IUserDocument, object, IUserMethods> {
  createUser(
    props: IUserCreate
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

export type IUserMutationResult = Promise<HydratedDocument<
  IUser,
  IUserMethods
> | null>;
