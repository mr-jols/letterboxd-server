/* eslint-disable @typescript-eslint/no-empty-interface */
import { Document, HydratedDocument, Model, Types } from "mongoose";
import { IFilmRatingIndex } from "../film/types";
import EntryState from "./states";

export interface IFilmEntry {
  film_id: Types.ObjectId;
  rating: IFilmRatingIndex;
  is_watched?: boolean;
  is_logged?: boolean;
  is_liked?: boolean;
  is_in_watchlist?: boolean;
  is_reviewed?: boolean;
  is_favourited?: boolean;
}

export interface IFilmEntryDocument extends IFilmEntry, Document {}

export type IFilmEntryThisContext = HydratedDocument<IFilmEntryDocument> &
  IFilmEntryMethods;

export interface IFilmEntryMethods {
  updateFilmEntry(
    this: IFilmEntryThisContext,
    rating: IFilmRatingIndex | null,
    stateProps?: EntryState
  ): IFilmEntryNonNullableMutationResult;
  deleteFilmEntry(
    this: IFilmEntryThisContext
  ): IFilmEntryNonNullableMutationResult;
}

export interface IFilmEntryModel
  extends Model<IFilmEntryDocument, object, IFilmEntryMethods> {
  createFilmEntry(
    defaultProps: IFilmEntryCreate,
    stateProps?: EntryState
  ): IFilmEntryNonNullableMutationResult;
}

export type IFilmEntryCreate = Pick<IFilmEntry, "film_id" | "rating">;

export type IFilmEntryUpdate = Omit<NonNullable<IFilmEntry>, "film_id">;

export type IFilmEntryMutationResult = Promise<HydratedDocument<
  IFilmEntry,
  IFilmEntryMethods
> | null>;

export type IFilmEntryNonNullableMutationResult = Promise<
  HydratedDocument<IFilmEntry, IFilmEntryMethods>
>;
