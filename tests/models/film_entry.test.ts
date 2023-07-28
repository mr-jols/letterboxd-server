/* eslint-disable init-declarations */
/* eslint-disable no-undef */
import { HydratedDocument } from "mongoose";
import FilmEntry from "../../src/models/film_entry";
import TestDb from "../config";
import { IFilm, IFilmMethods } from "../../src/models/film/types";
import Film from "../../src/models/film";
import FilmData from "../data/film_data";
import FilmEntryData from "../data/film_entry_data";
import { LoggedState, WatchedState } from "../../src/models/film_entry/states";

describe("Film Entry Model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  let film1: HydratedDocument<IFilm, IFilmMethods>;
  beforeEach(async () => {
    film1 = await Film.createFilm(FilmData.film1);
  });

  it("creates and validates film entry", async () => {
    const data = FilmEntryData.filmEntry1(film1._id);
    const filmEntry = await FilmEntry.createFilmEntry(data);
    expect(await FilmEntry.findById(filmEntry._id)).toBeTruthy();
  });

  it("updates a film entry", async () => {
    const entry = await FilmEntry.createFilmEntry(
      {
        ...FilmEntryData.filmEntry1(film1._id),
        rating: 5,
      },
      new WatchedState()
    );
    expect(entry?.is_logged).toBe(false);
    await entry.updateFilmEntry(10, new LoggedState());
    expect((await FilmEntry.findById(entry._id))?.is_logged).toBe(true);
  });

  it("deletes a film entry", async () => {
    const data = FilmEntryData.filmEntry1(film1._id);
    const filmEntry = await FilmEntry.createFilmEntry(data);
    await filmEntry.deleteFilmEntry();
    expect(await FilmEntry.findById(filmEntry.id)).toBe(null);
  });
});
