/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import filmSchema from "./schema";
import {
  IFilm,
  IFilmCreate,
  IFilmDocument,
  IFilmMethods,
  IFilmModel,
  IFilmNonNullableMutationResult,
  IFilmThisContext,
  IFilmUpdate,
} from "./types";
import { updateModel } from "../../utils/functions";

filmSchema.statics = {
  async createFilm(props: IFilmCreate): IFilmNonNullableMutationResult {
    const existingFilm = await Film.findOne({ movie_id: props.movie_id });
    if (existingFilm) return existingFilm.updateFilmDetails(props);
    return new Film({
      ...props,
    }).save();
  },
};

filmSchema.methods = {
  async updateFilmDetails(this, props) {
    return updateModel<IFilmThisContext, IFilmUpdate, IFilm, IFilmMethods>(
      this,
      {
        country_id: props.country_id ?? this.country_id,
        genre_id: props.genre_id ?? this.genre_id,
        language_id: props.language_id ?? this.language_id,
        movie_id: props.movie_id ?? this.movie_id,
        popularity: props.popularity ?? this.popularity,
        poster_path: props.poster_path ?? this.poster_path,
        release_date: props.release_date ?? this.release_date,
        runtime: props.runtime ?? this.runtime,
        title: props.title ?? this.title,
        is_released: props.is_released ?? this.is_released,
        is_tv_movie: props.is_tv_movie ?? this.is_tv_movie,
        watch_providers: props.watch_providers ?? this.watch_providers,
      }
    );
  },
  async addOneToRatingAt(this, index) {
    this.average_rating[index] += 1;
    return this.save();
  },
  async removeOneFromRatingAt(this, index) {
    if (this.average_rating[index] < 1) return this;
    this.average_rating[index] -= 1;
    return this.save();
  },
};

const Film = mongoose.model<IFilmDocument, IFilmModel>("Film", filmSchema);
export default Film;
