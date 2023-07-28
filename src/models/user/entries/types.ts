import { Document, HydratedDocument, Model, Types } from "mongoose";
import {
  IFilmEntry,
  IFilmEntryMethods,
  IFilmEntryMutationResult,
} from "../../film_entry/types";
import {
  IDiaryEntry,
  IDiaryEntryMethods,
  IDiaryEntryMutationResult,
} from "../../diary_entry/index/types";

export interface IUserEntries {
  user_id: Types.ObjectId;
  film_entry_ids: Types.ObjectId[];
  diary_entry_ids: Types.ObjectId[];
}

export type IUserEntriesCreate = Types.ObjectId;

export type IUserEntriesUpdateFilmEntry = Pick<IUserEntries, "film_entry_ids">;
export type IUserEntriesUpdateDiary = Pick<IUserEntries, "diary_entry_ids">;

export interface IUserEntriesDocument extends IUserEntries, Document {}

export interface IUserEntriesMethods {
  deleteUserEntries(this: IUserEntriesThisContext): IUserEntriesMutationResult;
  findOneFilmEntryByFilmId(
    this: IUserEntriesThisContext,
    film_id: Types.ObjectId
  ): IFilmEntryMutationResult;
  addFilmEntry(
    this: IUserEntriesThisContext,
    filmEntry: HydratedDocument<IFilmEntry, IFilmEntryMethods>
  ): IUserEntriesMutationResult;
  deleteFilmEntry(
    this: IUserEntriesThisContext,
    filmEntry: HydratedDocument<IFilmEntry, IFilmEntryMethods>
  ): IFilmEntryMutationResult;
  addDiaryEntry(
    this: IUserEntriesThisContext,
    diaryEntry: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>
  ): IUserEntriesMutationResult;
  deleteDiaryEntry(
    this: IUserEntriesThisContext,
    diaryEntry: HydratedDocument<IDiaryEntry, IDiaryEntryMethods>
  ): IDiaryEntryMutationResult;
}

export type IUserEntriesThisContext = HydratedDocument<IUserEntries> &
  IUserEntriesMethods;

export interface IUserEntriesModel
  extends Model<IUserEntriesDocument, object, IUserEntriesMethods> {
  createUserEntries(
    props: IUserEntriesCreate
  ): IUserEntriesNonNullableMutationResult;
}

export type IUserEntriesMutationResult = Promise<HydratedDocument<
  IUserEntries,
  IUserEntriesMethods
> | null>;

export type IUserEntriesNonNullableMutationResult = Promise<
  HydratedDocument<IUserEntries, IUserEntriesMethods>
>;
