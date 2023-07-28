import { Types } from "mongoose";
import { IFilmEntryCreate } from "../../src/models/film_entry/types";

class FilmEntryData {
  public static filmEntry1 = (film_id: Types.ObjectId): IFilmEntryCreate => ({
    rating: 7,
    film_id,
  });

  public static filmEntry2 = (film_id: Types.ObjectId): IFilmEntryCreate => ({
    rating: 1,
    film_id,
  });

  public static filmEntry3 = (film_id: Types.ObjectId): IFilmEntryCreate => ({
    rating: 10,
    film_id,
  });
}

export default FilmEntryData;
