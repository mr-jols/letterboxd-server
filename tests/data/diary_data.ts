import { IDiaryEntryCreate } from "../../src/models/diary_entry/index/types";

class DiaryEntryData {
  public static entry1: IDiaryEntryCreate = {
    rating: 5,
    date: "2020-04-08",
    is_a_rewatch: false,
  };

  public static entry2: IDiaryEntryCreate = {
    date: "2008-05",
    is_a_rewatch: true,
    rating:1
  };

  public static entry3: IDiaryEntryCreate = {
    rating: 10,
    date: "2010-11-07",
    is_a_rewatch: false,
  };
}

export default DiaryEntryData;
