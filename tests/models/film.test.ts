/* eslint-disable no-undef */
import Film from "../../src/models/film";
import TestDb from "../config";
import FilmData from "../data/film_data";

describe("Film Model test", () => {
  beforeAll(TestDb.connect);
  afterAll(TestDb.disconnect);
  afterEach(TestDb.dropCollections);

  it("validates, creates or in the case of existing Films, updates a Film", async () => {
    const filmOne = await Film.createFilm(FilmData.film1);
    expect((await Film.findById(filmOne._id))?.title).toEqual(
      FilmData.film1.title
    );
    const filmTwo = await Film.createFilm(FilmData.film1);
    expect(filmOne._id).toEqual(filmTwo._id);
    expect((await Film.find()).length).toBe(1);
  });

  it("updates a Film", async () => {
    const film = await Film.createFilm(FilmData.film1);
    expect(film.popularity).not.toBe(100);
    await film.updateFilmDetails({
      popularity: 100,
    });
    expect((await Film.findById(film._id))?.popularity).toBe(100);
  });

  it("updates Film average rating", async () => {
    const film = await Film.createFilm(FilmData.film1);
    await film.addOneToRatingAt(4);
    expect((await Film.findById(film._id))?.average_rating[4]).toBe(1);
    await film.removeOneFromRatingAt(4);
    await film.removeOneFromRatingAt(4);
    expect((await Film.findById(film._id))?.average_rating[4]).toBe(0);
  });
});
