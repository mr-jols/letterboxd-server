/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import TestDb from "../config";
import { IUser, IUserMethods } from "../../src/models/user/index/types";
import User from "../../src/models/user/index/index";
import UserData from "../data/user_data";
import CommentData from "../data/comment_data";
import List from "../../src/models/list/index/index";
import Film from "../../src/models/film";
import FilmData from "../data/film_data";
import { IFilm, IFilmMethods } from "../../src/models/film/types";
import ListEntryData from "../data/list_entry_data";
import ListData from "../data/list_data";
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
  beforeEach(async () => {
    user = await User.createUser(UserData.user1);
    film1 = await Film.createFilm(FilmData.film1);
    film2 = await Film.createFilm(FilmData.film2);
    film3 = await Film.createFilm(FilmData.film3);
  });
  it("creates and validates a List ", async () => {
    const list = await List.createList(
      ListData.List2([
        ListEntryData.ListEntry1(film1._id),
        ListEntryData.ListEntry2(film2._id),
      ])
    );
    expect(await List.findById(list._id)).toBeTruthy();
  });

  it("updates primary List attributes", async () => {
    const list = await List.createList(
      ListData.List1([
        ListEntryData.ListEntry1(film1._id),
        ListEntryData.ListEntry2(film2._id),
      ])
    );
    await list.updateList({
      list_entries: list.list_entries.concat(
        ListEntryData.ListEntry3(film3.id)
      ),
      description: "really great movies",
    });
    expect((await List.findById(list._id))?.list_entries.length).toBe(3);
  });

  it("updates List comments", async () => {
    const list = await List.createList(
      ListData.List1([ListEntryData.ListEntry1(film1._id)])
    );
    await list.addComment(CommentData.comment1(user._id));
    expect(list?.comment_ids.length).toBe(1);
    await list.removeComment(list!.comment_ids[0]._id);
    expect(list?.comment_ids.length).toBe(0);
  });

  it("updates List likes", async () => {
    const list = await List.createList(
      ListData.List1([ListEntryData.ListEntry1(film1._id)])
    );
    await list.addLike(user._id);
    expect(list?.like_ids.length).toBe(1);
    await list.removeLike(user._id);
    expect(list?.like_ids.length).toBe(0);
  });

  it("deletes a List", async () => {
    const list = await List.createList(
      ListData.List1([ListEntryData.ListEntry1(film1._id)])
    );
    await list.deleteList();
    expect(await List.find()).toEqual([]);
  });

  it("updates List comment activity", async () => {
    const list = await List.createList(
      ListData.List1([ListEntryData.ListEntry1(film1._id)])
    );
    await list.addComment(CommentData.comment1(user._id));
    expect(
      (await Activity.findOne({ subject_id: user._id, object_id: list._id }))
        ?.action
    ).toBe(ActivityActions.commentOnList);
    await list.removeComment(list!.comment_ids[0]._id);
    expect(
      await Activity.findOne({ subject_id: user._id, object_id: list._id })
    ).toBe(null);
  });

  it("updates List like activity", async () => {
    const list = await List.createList(
      ListData.List1([ListEntryData.ListEntry1(film1._id)])
    );
    await list.addLike(user._id);
    expect(
      (await Activity.findOne({ subject_id: user._id, object_id: list._id }))
        ?.action
    ).toBe(ActivityActions.likeList);
    await list.removeLike(user._id);
    expect(
      await Activity.findOne({ subject_id: user._id, object_id: list._id })
    ).toBe(null);
  });
});
