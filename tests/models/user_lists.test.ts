/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import TestDb from "../config";
import { IUser, IUserMethods } from "../../src/models/user/index/types";
import User from "../../src/models/user/index/index";
import UserData from "../data/user_data";
import List from "../../src/models/list/index/index";
import Film from "../../src/models/film";
import FilmData from "../data/film_data";
import { IFilm, IFilmMethods } from "../../src/models/film/types";
import ListEntryData from "../data/list_entry_data";
import ListData from "../data/list_data";
import { IList, IListMethods } from "../../src/models/list/index/types";
import UserLists from "../../src/models/user/lists";
import Activity from "../../src/models/activity";
import { ActivityActions } from "../../src/models/activity/types";

describe("List model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  let user: HydratedDocument<IUser, IUserMethods>;
  let film1: HydratedDocument<IFilm, IFilmMethods>;
  let film2: HydratedDocument<IFilm, IFilmMethods>;
  let film3: HydratedDocument<IFilm, IFilmMethods>;
  let film4: HydratedDocument<IFilm, IFilmMethods>;
  let film5: HydratedDocument<IFilm, IFilmMethods>;
  let film6: HydratedDocument<IFilm, IFilmMethods>;
  let film7: HydratedDocument<IFilm, IFilmMethods>;
  let list1: HydratedDocument<IList, IListMethods>;
  let list2: HydratedDocument<IList, IListMethods>;
  let list3: HydratedDocument<IList, IListMethods>;

  beforeEach(async () => {
    user = await User.createUser(UserData.user1);
    film1 = await Film.createFilm(FilmData.film1);
    film2 = await Film.createFilm(FilmData.film2);
    film3 = await Film.createFilm(FilmData.film3);
    film4 = await Film.createFilm(FilmData.film4);
    film5 = await Film.createFilm(FilmData.film5);
    film6 = await Film.createFilm(FilmData.film6);
    film7 = await Film.createFilm(FilmData.film7);

    list1 = await List.createList(
      ListData.List2([
        ListEntryData.ListEntry1(film1._id),
        ListEntryData.ListEntry2(film2._id),
        ListEntryData.ListEntry3(film3._id),
      ])
    );

    list2 = await List.createList(
      ListData.List2([
        ListEntryData.ListEntry3(film3._id),
        ListEntryData.ListEntry3(film4._id),
        ListEntryData.ListEntry4(film5._id),
      ])
    );

    list3 = await List.createList(
      ListData.List2([
        ListEntryData.ListEntry3(film5._id),
        ListEntryData.ListEntry3(film6._id),
        ListEntryData.ListEntry4(film7._id),
      ])
    );
  });
  it("creates and validates user lists ", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    expect(await UserLists.findById(userLists._id)).toBeTruthy();
  });

  it("adds list to userlists", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    await userLists.addList(list1);
    await userLists.addList(list2);
    expect(await userLists.addList(list1)).toBe(null);
    const updatedLists = await UserLists.findById(userLists._id);
    expect(updatedLists?.list_ids.includes(list1._id)).toBe(true);
    expect(updatedLists?.list_ids.includes(list2._id)).toBe(true);
  });

  it("removes list from userlists", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    await userLists.addList(list1);
    await userLists.addList(list2);
    await userLists.removeList(list2);
    expect(await userLists.removeList(list3)).toBe(null);
    expect(
      (await UserLists.findById(userLists._id))?.list_ids.includes(list2._id)
    ).toBe(false);
    expect(userLists.list_ids.length).toBe(1);
  });

  it("deletes user lists", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    await userLists.addList(list1);
    await userLists.deleteUserLists();
    expect(await UserLists.findById(userLists._id)).toBe(null);
    expect(await List.findById(list1._id)).toBe(null);
  });

  it("creates activity on list creation", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    await userLists.addList(list1);
    expect(
      (
        await Activity.findOne({
          subject_id: userLists.user_id,
          object_id: list1._id,
        })
      )?.action
    ).toBe(ActivityActions.createList);
  });

  it("deletes activity on list deletion", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    await userLists.addList(list1);
    await userLists.removeList(list1);
    expect(
      await Activity.findOne({
        subject_id: userLists.user_id,
        object_id: list1._id,
      })
    ).toBe(null);
  });

  it("bulk deletes activity on list deletion", async () => {
    const userLists = await UserLists.createUserLists(user._id);
    await userLists.addList(list1);
    await userLists.deleteUserLists();
    expect(
      (
        await Activity.find({
          subject_id: userLists.user_id,
          object_id: list1._id,
        })
      ).length
    ).toBe(0);
  });
});
