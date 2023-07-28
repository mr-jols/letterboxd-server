/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import User from "../../src/models/user/index";
import UserEntries from "../../src/models/user/entries";
import TestDb from "../config";
import UserData from "../data/user_data";
import { IUser } from "../../src/models/user/index/types";
import Film from "../../src/models/film";
import FilmData from "../data/film_data";
import { IFilm, IFilmMethods } from "../../src/models/film/types";
import {
  IFilmEntry,
  IFilmEntryMethods,
} from "../../src/models/film_entry/types";
import FilmEntry from "../../src/models/film_entry";
import FilmEntryData from "../data/film_entry_data";
import {
  IDiaryEntry,
  IDiaryEntryMethods,
} from "../../src/models/diary_entry/index/types";
import DiaryEntry from "../../src/models/diary_entry/index";
import DiaryEntryData from "../data/diary_data";
import ReviewData from "../data/review_data";
import Activity from "../../src/models/activity";

describe("User Entries model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);
  let user: HydratedDocument<IUser>;
  let film1: HydratedDocument<IFilm, IFilmMethods>;
  let film2: HydratedDocument<IFilm, IFilmMethods>;
  let filmEntry1: HydratedDocument<IFilmEntry, IFilmEntryMethods>;
  let filmEntry2: HydratedDocument<IFilmEntry, IFilmEntryMethods>;
  let diaryEntry1: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>;
  let diaryEntry2: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>;
  let diaryEntry3: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>;
  beforeEach(async () => {
    user = await User.createUser(UserData.user1);
    film1 = await Film.createFilm(FilmData.film1);
    film2 = await Film.createFilm(FilmData.film2);
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

    diaryEntry3 = await DiaryEntry.createDiaryEntry({
      diaryProps: DiaryEntryData.entry1,
      filmProps: FilmData.film2,
      reviewProps: ReviewData.review1,
    });
  });

  it("It creates and validates user entries", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    expect(await UserEntries.findById(userEntries._id)).toBeTruthy();
  });

  it("adds a new film entry to user film entries", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries?.addFilmEntry(filmEntry1);
    expect(
      (await UserEntries.findById(userEntries))?.film_entry_ids.length
    ).toBe(1);
    await userEntries?.addFilmEntry(filmEntry2);
    await userEntries?.addFilmEntry(filmEntry1);
    expect(
      (await UserEntries.findById(userEntries))?.film_entry_ids.length
    ).toBe(2);
  });

  it("deletes a film from user film entries", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addFilmEntry(filmEntry1);
    await userEntries.deleteFilmEntry(filmEntry1);
    const filmEntries = (await UserEntries.findById(userEntries._id))
      ?.film_entry_ids;
    expect(filmEntries?.length).toBe(0);
  });

  it("finds a film entry for a user by film id", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry3);
    const filmEntry = await userEntries.findOneFilmEntryByFilmId(film1._id);
    expect(filmEntry?.film_id).toBeTruthy();
  });

  it("add a new diary entry to user film entries", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry2);
    await userEntries.addDiaryEntry(diaryEntry1);

    const diary = await UserEntries.findById(userEntries._id);
    const filmEntries = await FilmEntry.find({
      _id: { $in: userEntries.film_entry_ids },
    });

    expect(filmEntries.length).toBe(1);
    expect(filmEntries[0].is_logged).toBe(true);
    expect(filmEntries[0].is_watched).toBe(true);
    expect(filmEntries[0].is_in_watchlist).toBe(false);
    expect(diary?.diary_entry_ids.length).toBe(2);
  });

  it("ensures valid rating per user", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry2);
    await userEntries.addDiaryEntry(diaryEntry3);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry1);

    const entries = await DiaryEntry.find({
      _id: { $in: userEntries?.diary_entry_ids },
    });
    const filmEntries = await FilmEntry.find({
      _id: { $in: entries.map((item) => item.film_entry_id) },
    });
    const films = await Film.find({
      _id: {
        $in: filmEntries.map((item) => item.film_id),
      },
    });

    const isRatingValid =
      films
        .map((item) => item.average_rating.reduce((acc, curr) => acc + curr), 0)
        .reduce((acc, val) => acc + val) === films.length;

    expect(filmEntries.length).toBe(2);
    expect(filmEntries[0]?.rating).toBe(diaryEntry1.rating);
    expect(isRatingValid).toBe(true);
  });

  it("ensures proper diary deletion", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry2);
    await userEntries?.deleteDiaryEntry(diaryEntry2);

    let entries = await DiaryEntry.find({
      _id: { $in: userEntries.diary_entry_ids },
    });

    let filmEntries = await FilmEntry.find({
      _id: { $in: userEntries?.film_entry_ids },
    });

    let films = await Film.find({
      _id: {
        $in: filmEntries.map((item) => item.film_id),
      },
    });

    expect(entries.length).toBe(1);
    expect(films.length).toBe(1);
    expect(filmEntries.length).toBe(1);
    expect(filmEntries[0].is_logged).toBe(true);
    expect(filmEntries[0].is_watched).toBe(true);
    await userEntries.deleteDiaryEntry(diaryEntry1);

    entries = await DiaryEntry.find({
      _id: { $in: userEntries?.diary_entry_ids },
    });
    filmEntries = await FilmEntry.find({
      _id: { $in: userEntries?.film_entry_ids },
    });
    films = await Film.find({
      _id: {
        $in: filmEntries.map((item) => item.film_id),
      },
    });

    expect(entries.length).toBe(0);
    expect(filmEntries.length).toBe(1);
    expect(films.length).toBe(1);
    expect(filmEntries[0].is_logged).toBe(false);
    expect(filmEntries[0].is_watched).toBe(true);
  });

  it("it deletes user entries", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.deleteUserEntries();
    expect(await UserEntries.findById(userEntries._id)).toBe(null);
  });

  it("creates user entries activity", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry3);
    await userEntries.addFilmEntry(filmEntry1);
    expect(filmEntry1.rating).toBeGreaterThan(0);
    expect((await Activity.find()).length).toBe(3);
  });

  it("deletes user entries activity", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry3);
    await userEntries.addFilmEntry(filmEntry1);

    await userEntries.deleteDiaryEntry(diaryEntry1);
    await userEntries.deleteDiaryEntry(diaryEntry3);
    await userEntries.deleteFilmEntry(filmEntry1);

    expect(
      (await Activity.find({ subject_id: userEntries.user_id })).length
    ).toBe(0);
  });

  it("bulk deletes user entries activity", async () => {
    const userEntries = await UserEntries.createUserEntries(user._id);
    await userEntries.addDiaryEntry(diaryEntry1);
    await userEntries.addDiaryEntry(diaryEntry2);
    await userEntries.addFilmEntry(filmEntry1);
    await userEntries.deleteUserEntries();
    expect(
      (await Activity.find({ subject_id: userEntries.user_id })).length
    ).toBe(0);
  });
});
