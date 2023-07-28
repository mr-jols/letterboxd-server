/* eslint-disable lines-between-class-members */
import { Types } from "mongoose";
import { IListEntryCreate } from "../../src/models/list/entry/types";

class ListEntryData {
  public static ListEntry1 = (film_id: Types.ObjectId): IListEntryCreate => ({
    film_id,
    note: "I saw this movie at home",
  });
  public static ListEntry2 = (film_id: Types.ObjectId): IListEntryCreate => ({
    film_id,
    note: "I can't remember where i saw this movie",
  });
  public static ListEntry3 = (film_id: Types.ObjectId): IListEntryCreate => ({
    film_id,
    note: "Great movie, hope to see it",
  });
  public static ListEntry4 = (film_id: Types.ObjectId): IListEntryCreate => ({
    film_id,
  });
}

export default ListEntryData;
