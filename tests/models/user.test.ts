/* eslint-disable no-undef */
import User from "../../src/models/user/index";
import UserData from "../data/user_data";
import TestDb from "../config";
import Activity from "../../src/models/activity";
import { ActivityActions } from "../../src/models/activity/types";
import UserProfile from "../../src/models/user/profile";

describe("User Model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);
  it("ensures that test db has no users", async () => {
    expect(await User.find()).toEqual([]);
  });

  it("saves a single user to database", async () => {
    const user = await User.createUser(UserData.user1);
    expect((await User.findById(user._id))?.username).toBe(
      UserData.user1.username
    );
  });

  it("initializes a user", async () => {
    const user = await User.createUser(UserData.user1);
    await user.initialize();
    expect(
      await Activity.findOne({
        action: ActivityActions.joinLetterboxd,
        subject_id: user._id,
        object_id: user._id,
      })
    ).toBeTruthy();

    expect(
      await UserProfile.findOne({
        user_id: user._id,
      })
    ).toBeTruthy();
  });

  it("authenticates an existing user", async () => {
    const user = await User.createUser(UserData.user1);
    expect(user?.authenticate(UserData.user1.password)).toBe(true);
  });

  it("follows a user", async () => {
    const user = await User.createUser(UserData.user1);
    const user2 = await User.createUser(UserData.user2);
    const user3 = await User.createUser(UserData.user3);
    await user.follow(user2);
    await user.follow(user3);

    const activities = await Activity.find();
    expect(activities.length).toBe(2);
    expect(activities[0].action).toBe(ActivityActions.followUser);
    expect(await user.follow(user)).toBe(null);
    expect(user?.following.length).toBe(2);
    expect(user2?.followers).toContainEqual(user._id);
  });

  it("unfollows a user", async () => {
    const user = await User.create(UserData.user1);
    const user2 = await User.create(UserData.user2);
    const user3 = await User.create(UserData.user3);
    await user.follow(user2);
    await user.follow(user3);
    await user?.unfollow(user2);
    await User.findById(user2._id);

    expect(await user?.unfollow(user)).toBe(null);
    expect(user?.following.length).toBe(1);
    expect(user2?.followers).not.toContainEqual(user._id);
  });

  it("blocks a user", async () => {
    const user = await User.create(UserData.user1);
    const user2 = await User.create(UserData.user2);
    const user3 = await User.create(UserData.user3);
    await user.follow(user2);
    await user?.block(user2);
    await user?.block(user3);

    expect(user?.blocklist).toEqual([user2._id, user3._id]);
    expect(await user?.follow(user3)).toBe(null);
    expect(await user?.unfollow(user2)).toBe(null);
    expect(await user?.block(user)).toBe(null);
    expect(user2?.followers).not.toContain(user._id);
  });

  it("unblocks a user", async () => {
    const user = await User.create(UserData.user1);
    const user2 = await User.create(UserData.user2);
    const user3 = await User.create(UserData.user3);
    await user2.follow(user);
    await user.block(user2);
    await user?.unblock(user2!);

    expect(await user.unblock(user3)).toBe(null);
    expect(user?.blocklist.length).toBe(0);
    expect(user2?.following).not.toContainEqual(user._id);
  });
});
