/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import Film from "../../src/models/film";
import { IFilm, IFilmMethods } from "../../src/models/film/types";
import TestDb from "../config";
import FilmData from "../data/film_data";
import ListEntry from "../../src/models/list/entry";
import ListEntryData from "../data/list_entry_data";

describe("Diary Model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  let film1: HydratedDocument<IFilm, IFilmMethods>;
  beforeEach(async () => {
    film1 = await Film.createFilm(FilmData.film1);
  });

  it("creates and validates a list entry", async () => {
    const listEntry = await ListEntry.createListEntry(
      ListEntryData.ListEntry1(film1._id)
    );
    expect(await ListEntry.findById(listEntry._id)).toBeTruthy();
  });

  it("updates a list entry", async () => {
    const newNote = "Great movie";
    const listEntry = await ListEntry.createListEntry(
      ListEntryData.ListEntry1(film1._id)
    );
    expect(newNote).not.toBe(listEntry.note);
    await listEntry.updateListEntry({
      note: newNote,
    });
    expect((await ListEntry.findById(listEntry))?.note).toBe(newNote);
  });

  it("deletes a list entry", async () => {
    const listEntry = await ListEntry.createListEntry(
      ListEntryData.ListEntry1(film1._id)
    );
    await listEntry.deleteListEntry();
    expect(await ListEntry.findById(listEntry._id)).toBe(null);
  });
});
