/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import User from "../../src/models/user/index";
import UserData from "../data/user_data";
import { IUser, IUserMethods } from "../../src/models/user/index/types";
import TestDb from "../config";
import Activity from "../../src/models/activity";
import { ActivityActions } from "../../src/models/activity/types";
import { IFilm, IFilmMethods } from "../../src/models/film/types";
import { IList, IListMethods } from "../../src/models/list/index/types";
import FilmData from "../data/film_data";
import Film from "../../src/models/film";
import ListEntryData from "../data/list_entry_data";
import ListData from "../data/list_data";
import List from "../../src/models/list/index";
import {
  IFilmEntry,
  IFilmEntryMethods,
} from "../../src/models/film_entry/types";
import {
  IDiaryEntry,
  IDiaryEntryMethods,
} from "../../src/models/diary_entry/index/types";
import FilmEntry from "../../src/models/film_entry";
import DiaryEntry from "../../src/models/diary_entry/index";
import FilmEntryData from "../data/film_entry_data";
import DiaryEntryData from "../data/diary_data";
import ReviewData from "../data/review_data";

describe("Activity model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  let user1: HydratedDocument<IUser, IUserMethods>;
  let user2: HydratedDocument<IUser, IUserMethods>;

  let film1: HydratedDocument<IFilm, IFilmMethods>;
  let film2: HydratedDocument<IFilm, IFilmMethods>;
  let film3: HydratedDocument<IFilm, IFilmMethods>;
  let film4: HydratedDocument<IFilm, IFilmMethods>;

  let filmEntry1: HydratedDocument<IFilmEntry, IFilmEntryMethods>;
  let filmEntry2: HydratedDocument<IFilmEntry, IFilmEntryMethods>;

  let diaryEntry1: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>;
  let diaryEntry2: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>;

  let list1: HydratedDocument<IList, IListMethods>;
  let list2: HydratedDocument<IList, IListMethods>;

  beforeEach(async () => {
    user1 = await User.createUser(UserData.user1);
    user2 = await User.createUser(UserData.user2);

    film1 = await Film.createFilm(FilmData.film1);
    film2 = await Film.createFilm(FilmData.film2);
    film3 = await Film.createFilm(FilmData.film3);
    film4 = await Film.createFilm(FilmData.film4);

    filmEntry1 = await FilmEntry.createFilmEntry({
      ...FilmEntryData.filmEntry1(film1._id),
    });
    filmEntry2 = await FilmEntry.createFilmEntry({
      ...FilmEntryData.filmEntry3(film2._id),
    });

    diaryEntry1 = await DiaryEntry.createDiaryEntry({
      diaryProps: DiaryEntryData.entry3,
      filmProps: FilmData.film1,
      reviewProps: ReviewData.review1,
    });
    diaryEntry2 = await DiaryEntry.createDiaryEntry({
      diaryProps: DiaryEntryData.entry2,
      filmProps: FilmData.film1,
      reviewProps: ReviewData.review2,
    });

    list1 = await List.createList(
      ListData.List2([
        ListEntryData.ListEntry1(film1._id),
        ListEntryData.ListEntry2(film2._id),
      ])
    );
    list2 = await List.createList(
      ListData.List2([
        ListEntryData.ListEntry3(film3._id),
        ListEntryData.ListEntry3(film4._id),
      ])
    );
  });

  it("creates and validates an activity", async () => {
    const activity = await Activity.createActivity({
      action: ActivityActions.followUser,
      subject_id: user1._id,
      object_id: user2._id,
    });
    expect(await Activity.findById(activity._id)).toBeTruthy();
  });

  it("deletes an activity", async () => {
    const activity = await Activity.createActivity({
      action: ActivityActions.followUser,
      subject_id: user1._id,
      object_id: user2._id,
    });
    await activity.deleteActivity();
    expect(await Activity.findById(activity._id)).toBeFalsy();
  });

  it("tests follow-user activity", async () => {
    const activity1 = await Activity.createFollowUserActivity({
      subject_id: user1._id,
      object_id: user2._id,
    });
    await Activity.createFollowUserActivity({
      subject_id: user1._id,
      object_id: user2._id,
    });
    const activities = await Activity.find({
        subject_id: user1._id,
        object_id: user2._id,
        action: ActivityActions.followUser,
      });
    expect(activities.length).toBe(1);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.followUser);
  });

  it("tests add-film-to-watchlist activity", async () => {
    await Activity.createAddFilmToWatchlistActivity({
      subject_id: user1._id,
      object_id: filmEntry1._id,
    });
    const activity1 = await Activity.createAddFilmToWatchlistActivity({
      subject_id: user1._id,
      object_id: filmEntry1._id,
    });
    const activities = await Activity.find({
      subject_id: user1._id,
      object_id: filmEntry1._id,
      action: ActivityActions.addFilmToWatchlist,
    });
    expect(activities.length).toBe(1);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.addFilmToWatchlist);
  });

  it("tests rate-film activity", async () => {
    await Activity.createRateFilmActivity({
      subject_id: user1._id,
      object_id: filmEntry1._id,
    });
    const activity1 = await Activity.createRateFilmActivity({
      subject_id: user1._id,
      object_id: filmEntry1._id,
    });
    let activities = await Activity.find({
        subject_id: user1._id,
        action: ActivityActions.rateFilm,
      });
    expect(activities.length).toBe(1);
    await Activity.createRateFilmActivity({
      subject_id: user1._id,
      object_id: filmEntry2._id,
    });
    activities = await Activity.find({
      subject_id: user1._id,
      action: ActivityActions.rateFilm,
    });
    expect(activities.length).toBe(2);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.rateFilm);
  });

  it("tests log-film activity", async () => {
    await Activity.createLogFilmActivity({
      subject_id: user1._id,
      object_id: diaryEntry1._id,
    });
    const activity1 = await Activity.createLogFilmActivity({
      subject_id: user1._id,
      object_id: diaryEntry1._id,
    });
    await Activity.createLogFilmActivity({
      subject_id: user1._id,
      object_id: diaryEntry2._id,
    });
    const activities = await Activity.find({
      subject_id: user1._id,
      action: ActivityActions.logFilm,
    });
    expect(activities.length).toBe(2);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.logFilm);
  });

  it("tests like-review activity", async () => {
    await Activity.createLikeReviewActivity({
      subject_id: user1._id,
      object_id: diaryEntry1.review_id!,
    });
    const activity1 = await Activity.createLikeReviewActivity({
      subject_id: user1._id,
      object_id: diaryEntry1.review_id!,
    });
    const activities = await Activity.find({
      subject_id: user1._id,
      object_id: diaryEntry1.review_id!,
      action: ActivityActions.likeReview,
    });
    expect(activities.length).toBe(1);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.likeReview);
  });

  it("tests comment-on-review activity", async () => {
    await Activity.createCommentOnReviewActivity({
      subject_id: user1._id,
      object_id: diaryEntry1.review_id!,
    });
    const activity1 = await Activity.createCommentOnReviewActivity({
      subject_id: user1._id,
      object_id: diaryEntry1.review_id!,
    });
    const activities = await Activity.find({
      subject_id: user1._id,
      object_id: diaryEntry1.review_id!,
      action: ActivityActions.commentOnReview,
    });
    expect(activities.length).toBe(1);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.commentOnReview);
  });

  it("tests create-list activity", async () => {
    await Activity.createCreateListActivity({
      subject_id: user1._id,
      object_id: list1._id,
    });
    const activity1 = await Activity.createCreateListActivity({
      subject_id: user1._id,
      object_id: list1._id,
    });
    let activities = await Activity.find({
        subject_id: user1._id,
        action: ActivityActions.createList,
      });
    expect(activities.length).toBe(1);
    await Activity.createCreateListActivity({
      subject_id: user1._id,
      object_id: list2._id,
    });
    activities = await Activity.find({
      subject_id: user1._id,
      action: ActivityActions.createList,
    });
    expect(activities.length).toBe(2);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.createList);
  });

  it("tests like-list activity", async () => {
    await Activity.createLikeListActivity({
      subject_id: user1._id,
      object_id: list1._id,
    });
    const activity1 = await Activity.createLikeListActivity({
      subject_id: user1._id,
      object_id: list1._id,
    });
    const activities = await Activity.find({
      subject_id: user1._id,
      object_id: list1._id,
      action: ActivityActions.likeList,
    });
    expect(activities.length).toBe(1);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.likeList);
  });

  it("tests comment-on-list activity", async () => {
    await Activity.createCommentOnListActivity({
      subject_id: user1._id,
      object_id: list1._id,
    });
    const activity1 = await Activity.createCommentOnListActivity({
      subject_id: user1._id,
      object_id: list1._id,
    });
    const activities = await Activity.find({
      subject_id: user1._id,
      object_id: list1._id,
      action: ActivityActions.commentOnList,
    });
    expect(activities.length).toBe(1);
    expect(activities[0]._id).toEqual(activity1?._id);
    expect(activities[0].action).toEqual(ActivityActions.commentOnList);
  });
});
