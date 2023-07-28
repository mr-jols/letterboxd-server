/* eslint-disable init-declarations */
/* eslint-disable no-undef */

import { HydratedDocument } from "mongoose";
import TestDb from "../config";
import { IUser, IUserMethods } from "../../src/models/user/index/types";
import User from "../../src/models/user/index/index";
import UserData from "../data/user_data";
import UserProfile from "../../src/models/user/profile";
import { IUserProfileRead } from "../../src/models/user/profile/types";

describe("Comment model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);
  let user: HydratedDocument<IUser, IUserMethods>;
  beforeEach(async () => {
    user = await User.createUser(UserData.user1);
  });

  it("creates and validates a user profile", async () => {
    const userProfile = await UserProfile.createUserProfile(user._id);
    expect(await UserProfile.findById(userProfile._id)).toBeTruthy();
  });

  it("reads a user profile", async () => {
    const userProfile = await UserProfile.createUserProfile(user._id);
    const readProfile = await userProfile.readUserProfile();

    expect(readProfile).toEqual(<IUserProfileRead>{
      profile_id: userProfile._id,
      user_id: userProfile.user_id,
      username: user.username,
      avi: userProfile.avi,
      bio: userProfile.bio,
      email: user.email,
      family_name: userProfile.family_name,
      given_name: userProfile.given_name,
      location: userProfile.location,
      pronoun: userProfile.pronoun,
      twitter: userProfile.twitter,
      website: userProfile.website,
    });
  });

  it("updates a user profile", async () => {
    const newEmail = "one@gmail.com";
    const userProfile = await UserProfile.createUserProfile(user._id);
    await userProfile.updateUserProfile({
      email: newEmail,
    });
    expect((await User.findById(user._id))?.email).toBe(newEmail);
    expect((await UserProfile.findById(userProfile._id))?.email).toBe(newEmail);
  });

  it("deletes a user profile", async () => {
    const userProfile = await UserProfile.createUserProfile(user._id);
    await userProfile.deleteUserProfile();
    expect(await UserProfile.findById(userProfile._id)).toBeNull();
  });
});
