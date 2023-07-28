/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose, { HydratedDocument } from "mongoose";
import diaryEntrySchema from "./schema";
import {
  IDiaryEntry,
  IDiaryEntryDocument,
  IDiaryEntryModel,
  IDiaryEntryThisContext,
  IDiaryEntryUpdate,
  IDiaryEntryMethods,
  IDiaryEntryCreate,
  IDiaryEntryMutationResult,
} from "./types";
import { updateModel } from "../../../utils/functions";
import { IReviewCreate } from "../review/types";
import Review from "../review";
import Film from "../../film";
import FilmEntry from "../../film_entry";
import { LoggedState } from "../../film_entry/states";
import { IFilmCreate } from "../../film/types";

diaryEntrySchema.statics = {
  async createDiaryEntry({
    diaryProps,
    filmProps,
    reviewProps,
  }: {
    diaryProps: IDiaryEntryCreate;
    filmProps: IFilmCreate;
    reviewProps: IReviewCreate;
  }): IDiaryEntryMutationResult {
    if (!diaryProps.rating) diaryProps.rating = 0;
    const film = await Film.createFilm(filmProps);
    const filmEntry = await FilmEntry.createFilmEntry(
      {
        film_id: film._id,
        rating: diaryProps.rating,
      },
      new LoggedState()
    );

    const review = reviewProps ? await Review.createReview(reviewProps) : null;
    return new DiaryEntry({
      ...diaryProps,
      film_entry_id: filmEntry?._id,
      review_id: review?._id ?? null,
      tags: Array.from(new Set(diaryProps.tags)),
    }).save();
  },
};

diaryEntrySchema.methods = {
  async updateDiaryEntry(this, { diaryProps, reviewProps }) {
    let review: HydratedDocument<IReviewCreate> | null = null;
    if (!this.review_id && reviewProps)
      review = await Review.createReview(reviewProps);
    return updateModel<
      IDiaryEntryThisContext,
      IDiaryEntryUpdate,
      IDiaryEntry,
      IDiaryEntryMethods
    >(this, {
      date: diaryProps?.date ?? this.date,
      is_a_rewatch: diaryProps?.is_a_rewatch ?? this.is_a_rewatch,
      rating: diaryProps?.rating ?? this.rating,
      review_id: review?._id ?? this.review_id,
      film_entry_id: diaryProps?.film_entry_id ?? this.film_entry_id,
      tags: Array.from(new Set(diaryProps?.tags)) ?? this.tags,
    });
  },
  async deleteDiaryEntry(this) {
    if (this.review_id) await Review.findByIdAndDelete(this.review_id);
    return this.deleteOne();
  },
};

const DiaryEntry = mongoose.model<IDiaryEntryDocument, IDiaryEntryModel>(
  "DiaryEntry",
  diaryEntrySchema
);
export default DiaryEntry;
