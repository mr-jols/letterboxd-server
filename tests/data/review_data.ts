import { IReviewCreate } from "../../src/models/diary_entry/review/types";

class ReviewData {
  public static review1: IReviewCreate = {
    review: "I love this movie so much",
    contains_spoilers: false,
  };

  public static review2: IReviewCreate = {
    review: "I hate this movie so much",
    contains_spoilers: true,
  };
}

export default ReviewData;
