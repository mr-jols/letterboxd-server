import mongoose, { Document, HydratedDocument, Model, Types } from "mongoose";
import { IFilmCreate, IFilmRatingIndex } from "../../film/types";
import { IReviewCreate } from "../review/types";

export interface IDiaryEntry {
  film_entry_id: Types.ObjectId;
  review_id?: Types.ObjectId;
  rating?: IFilmRatingIndex;
  is_a_rewatch?: boolean;
  date?: string;
  tags?: string[];
}

export type IDiaryEntryCreate = Pick<
  IDiaryEntry,
  "rating" | "is_a_rewatch" | "date" | "review_id" | "tags"
>;

export type IDiaryEntryUpdate = Partial<IDiaryEntry>;

export interface IDiaryEntryDocument extends Document, IDiaryEntry {}

export type IDiaryEntryThisContext = HydratedDocument<IDiaryEntryDocument> &
  IDiaryEntryMethods;

export interface IDiaryEntryModel
  extends Model<IDiaryEntryDocument, object, IDiaryEntryMethods> {
  createDiaryEntry(props: {
    diaryProps: IDiaryEntryCreate;
    filmProps: IFilmCreate;
    reviewProps?: IReviewCreate;
  }): IDiaryEntryNonNullableMutationResult;
}

export interface IDiaryEntryMethods {
  updateDiaryEntry(
    this: IDiaryEntryThisContext,
    props: {
      diaryProps?: Omit<IDiaryEntryUpdate, "review_id">;
      reviewProps?: IReviewCreate;
    }
  ): IDiaryEntryNonNullableMutationResult;
  deleteDiaryEntry(
    this: IDiaryEntryThisContext
  ): IDiaryEntryNonNullableMutationResult;
}

export type IDiaryEntryMutationResult = Promise<HydratedDocument<
  IDiaryEntry,
  IDiaryEntryMethods
> | null>;

export type IDiaryEntryNonNullableMutationResult = Promise<
  HydratedDocument<IDiaryEntry, IDiaryEntryMethods>
>;
