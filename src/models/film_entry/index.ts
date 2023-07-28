/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import {
  IFilmEntry,
  IFilmEntryCreate,
  IFilmEntryDocument,
  IFilmEntryMethods,
  IFilmEntryModel,
  IFilmEntryNonNullableMutationResult,
  IFilmEntryThisContext,
  IFilmEntryUpdate,
} from "./types";
import filmEntrySchema from "./schema";
import { updateModel } from "../../utils/functions";
import EntryState, { watchlistedState } from "./states";
import Film from "../film";
import Activity from "../activity";

filmEntrySchema.statics = {
  async createFilmEntry(
    defaultProps: IFilmEntryCreate,
    stateProps: EntryState
  ): IFilmEntryNonNullableMutationResult {
    return new FilmEntry({ ...defaultProps, ...stateProps?.state }).save();
  },
};

filmEntrySchema.methods = {
  async updateFilmEntry(this, rating, entryState) {
    if (rating && rating !== this.rating) {
      const averageRating = await Film.findById(this.film_id);
      await averageRating?.removeOneFromRatingAt(this.rating);
      await averageRating?.addOneToRatingAt(rating);
    }
    return updateModel<
      IFilmEntryThisContext,
      IFilmEntryUpdate,
      IFilmEntry,
      IFilmEntryMethods
    >(this, {
      rating: rating ?? this.rating,
      is_favourited: entryState?.state.is_favourited ?? this.is_favourited,
      is_liked: entryState?.state.is_liked ?? this.is_liked,
      is_reviewed: entryState?.state.is_reviewed ?? this.is_reviewed,
      is_in_watchlist:
        entryState?.state.is_in_watchlist ?? this.is_in_watchlist,
      is_logged: entryState?.state.is_logged ?? this.is_logged,
      is_watched: entryState?.state.is_watched ?? this.is_watched,
    });
  },
  async deleteFilmEntry(this) {
    return this.deleteOne();
  },
};

const FilmEntry = mongoose.model<IFilmEntryDocument, IFilmEntryModel>(
  "FilmEntry",
  filmEntrySchema
);
export default FilmEntry;
