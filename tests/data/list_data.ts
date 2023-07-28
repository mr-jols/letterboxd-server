/* eslint-disable lines-between-class-members */
import { IListCreate } from "../../src/models/list/index/types";
import { IListEntryCreate } from "../../src/models/list/entry/types";

class ListData {
  public static List1 = (listEntries: IListEntryCreate[]): IListCreate => ({
    listEntries,
    props: {
      is_private: true,
      is_ranked: true,
      tags: ["money", "monster", "drama"],
      title: "Top 250 movies",
      description: "best movies of all time",
    },
  });

  public static List2 = (listEntries: IListEntryCreate[]): IListCreate => ({
    listEntries,
    props: {
      is_private: true,
      is_ranked: false,
      tags: ["action", "guns", "action"],
      title: "Action movie mojo",
      description: "best actions movies of all time",
    },
  });

  public static List3 = (listEntries: IListEntryCreate[]): IListCreate => ({
    listEntries,
    props: {
      is_private: false,
      is_ranked: false,
      tags: ["slow", "cinema", "pretentious"],
      title: "Befriending my lyrical loneliness",
      description: "best slow movies",
    },
  });
}

export default ListData;
