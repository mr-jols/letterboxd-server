/* eslint-disable no-undef */
import DiaryEntry from "../../src/models/diary_entry/index";
import TestDb from "../config";
import FilmData from "../data/film_data";
import DiaryEntryData from "../data/diary_data";
import Review from "../../src/models/diary_entry/review";
import FilmEntry from "../../src/models/film_entry";

describe("Diary Model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  it("creates and validates a diary entry", async () => {
    const diaryEntry = await DiaryEntry.createDiaryEntry({
      diaryProps: DiaryEntryData.entry3,
      filmProps: FilmData.film1,
    });
    const filmEntry = await FilmEntry.findById(diaryEntry.film_entry_id);
    expect(await DiaryEntry.findById(diaryEntry._id)).toBeTruthy();
    expect(filmEntry?.is_logged).toBe(true);
  });

  it("updates a diary entry", async () => {
    const diaryEntry = await DiaryEntry.createDiaryEntry({
      diaryProps: DiaryEntryData.entry3,
      filmProps: FilmData.film1,
    });
    let entryUpdate = await diaryEntry.updateDiaryEntry({
      diaryProps: {
        date: "1999",
        is_a_rewatch: !diaryEntry.is_a_rewatch,
        rating: 0,
      },
      reviewProps: {
        contains_spoilers: false,
        review: "Movies rock",
      },
    });
    expect(diaryEntry?.date).toBe(entryUpdate.date);
    expect(diaryEntry?.is_a_rewatch).toBe(entryUpdate.is_a_rewatch);
    expect(diaryEntry?.rating).toBe(entryUpdate.rating);
    expect(diaryEntry?.review_id).toEqual(entryUpdate.review_id);
    entryUpdate = await diaryEntry.updateDiaryEntry({
      reviewProps: {
        contains_spoilers: true,
        review: "Movies suck",
      },
    });
    expect(diaryEntry?.review_id).toEqual(entryUpdate.review_id);
  });

  it("deletes a diary entry", async () => {
    const entry = await DiaryEntry.createDiaryEntry({
      diaryProps: DiaryEntryData.entry3,
      filmProps: FilmData.film1,
      reviewProps: {
        contains_spoilers: false,
        review: "Movies rock",
      },
    });
    await entry.deleteDiaryEntry();
    expect(await Review.find()).toEqual([]);
    expect(await DiaryEntry.find()).toEqual([]);
  });
});
