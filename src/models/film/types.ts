import { Document, HydratedDocument, Model, Types } from "mongoose";

export interface IFilm {
  title: string;
  poster_path: string;
  popularity: number;
  genre_id: number[];
  country_id: string[];
  language_id: string;
  runtime: number;
  release_date: string;
  movie_id: number;
  average_rating: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  watch_providers?: {
    flatrate?: number[];
    buy?: number[];
    rent?: number[];
    free?: number[];
  };
  is_released?: boolean;
  is_tv_movie?: boolean;
}

export interface IFilmDocument extends IFilm, Document {}

export interface IFilmMethods {
  updateFilmDetails(
    this: IFilmThisContext,
    props: Partial<IFilmUpdate>
  ): IFilmNonNullableMutationResult;
  addOneToRatingAt(
    this: IFilmThisContext,
    index: IFilmRatingIndex
  ): IFilmNonNullableMutationResult;
  removeOneFromRatingAt(
    this: IFilmThisContext,
    index: IFilmRatingIndex
  ): IFilmNonNullableMutationResult;
}

export type IFilmThisContext = HydratedDocument<IFilmDocument> &
  IFilmMethods;

export interface IFilmModel
  extends Model<IFilmDocument, object, IFilmMethods> {
  createFilm(props: IFilmCreate): IFilmNonNullableMutationResult;
}

export type IFilmCreate = Omit<IFilm, "average_rating">;

export type IFilmUpdate = Omit<NonNullable<IFilm>, "average_rating">;

export type IFilmUpdateAverageRating= Pick<IFilm, "average_rating">;

export type IFilmNonNullableMutationResult = Promise<
  HydratedDocument<IFilm, IFilmMethods>
>;
export type IFilmMutationResult = Promise<HydratedDocument<
  IFilm,
  IFilmMethods
> | null>;

export type IFilmRatingIndex =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;
