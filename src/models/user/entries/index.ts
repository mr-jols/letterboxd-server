/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";
import userEntriesSchema from "./schema";
import {
  IUserEntries,
  IUserEntriesCreate,
  IUserEntriesDocument,
  IUserEntriesMethods,
  IUserEntriesModel,
  IUserEntriesNonNullableMutationResult,
  IUserEntriesThisContext,
  IUserEntriesUpdateDiary,
  IUserEntriesUpdateFilmEntry,
} from "./types";
import { updateModel } from "../../../utils/functions";
import FilmEntry from "../../film_entry";
import { InternalServerError } from "../../../utils/errors/errors";
import Film from "../../film";
import DiaryEntry from "../../diary_entry/index";
import { loggedToWatchedState } from "../../film_entry/states";
import Activity from "../../activity";

userEntriesSchema.statics = {
  async createUserEntries(
    user_id: IUserEntriesCreate
  ): IUserEntriesNonNullableMutationResult {
    return new UserEntries({ user_id }).save();
  },
};

userEntriesSchema.methods = {
  async deleteUserEntries(this) {
    await Activity.deleteMany({
      subject_id: this.user_id,
      object_id: { $in: this.film_entry_ids },
    });
    await FilmEntry.deleteMany({ _id: { $in: this.film_entry_ids } });
    await DiaryEntry.deleteMany({ _id: { $in: this.diary_entry_ids } });
    return this.deleteOne();
  },
  async findOneFilmEntryByFilmId(this, film_id) {
    const film = await Film.findById(film_id);
    if (!film) return null;
    return FilmEntry.findOne({
      _id: { $in: this.film_entry_ids },
      film_id: film._id,
    });
  },
  async addFilmEntry(this, filmEntry) {
    if (this.film_entry_ids.includes(filmEntry._id)) return null;
    if (filmEntry.is_in_watchlist) {
      await Activity.createAddFilmToWatchlistActivity({
        subject_id: this.user_id,
        object_id: filmEntry._id,
      });
    } else if (filmEntry.is_logged) {
      await Activity.createLogFilmActivity({
        subject_id: this.user_id,
        object_id: filmEntry._id,
      });
    } else if (filmEntry.rating) {
      await Activity.createRateFilmActivity({
        subject_id: this.user_id,
        object_id: filmEntry._id,
      });
    }
    (await Film.findById(filmEntry.film_id))?.addOneToRatingAt(
      filmEntry.rating
    );
    return updateModel<
      IUserEntriesThisContext,
      IUserEntriesUpdateFilmEntry,
      IUserEntries,
      IUserEntriesMethods
    >(this, { film_entry_ids: this.film_entry_ids.concat(filmEntry._id) });
  },
  async deleteFilmEntry(this, filmEntry) {
    if (filmEntry.is_in_watchlist) {
      await Activity.deleteAddFilmToWatchlistActivity({
        subject_id: this.user_id,
        object_id: filmEntry._id,
      });
    } else if (filmEntry.is_logged) {
      await Activity.deleteLogFilmActivity({
        subject_id: this.user_id,
        object_id: filmEntry._id,
      });
    } else if (filmEntry.rating) {
      await Activity.deleteRateFilmActivity({
        subject_id: this.user_id,
        object_id: filmEntry._id,
      });
    }
    (await Film.findById(filmEntry.film_id))?.removeOneFromRatingAt(
      filmEntry.rating
    );
    await updateModel<
      IUserEntriesThisContext,
      IUserEntriesUpdateFilmEntry,
      IUserEntries,
      IUserEntriesMethods
    >(this, {
      film_entry_ids: this.film_entry_ids.filter(
        (item) => !item._id.equals(filmEntry._id)
      ),
    });
    return filmEntry.deleteFilmEntry();
  },
  async addDiaryEntry(this, diaryEntry) {
    if (this.diary_entry_ids.includes(diaryEntry._id)) return null;
    const currentFilmEntry = await FilmEntry.findById(diaryEntry.film_entry_id);
    const currentFilm = await Film.findById(currentFilmEntry?.film_id);

    if (!currentFilmEntry || !currentFilm)
      throw new InternalServerError(
        "Current film/Current film entry not found in add diary entry"
      );
    const olderFilmEntry = await this.findOneFilmEntryByFilmId(currentFilm._id);

    if (olderFilmEntry) {
      if (currentFilmEntry.rating === 0)
        await currentFilmEntry.updateFilmEntry(olderFilmEntry.rating);
      const olderDiaryEntriesOfFilm = await DiaryEntry.find({
        film_entry_id: olderFilmEntry._id,
      });

      for (const item of olderDiaryEntriesOfFilm) {
        await item.updateDiaryEntry({
          diaryProps: {
            film_entry_id: currentFilmEntry._id,
          },
        });
      }
      await this.deleteFilmEntry(olderFilmEntry);
      await this.addFilmEntry(currentFilmEntry);
    } else {
      await this.addFilmEntry(currentFilmEntry);
    }
    await this.addFilmEntry(currentFilmEntry);
    return updateModel<
      IUserEntriesThisContext,
      IUserEntriesUpdateDiary,
      IUserEntries,
      IUserEntriesMethods
    >(this, { diary_entry_ids: this.diary_entry_ids.concat(diaryEntry._id) });
  },
  async deleteDiaryEntry(this, diaryEntry) {
    const entry = await DiaryEntry.findById(diaryEntry._id);
    if (!entry) return null;
    const currentFilmEntry = await FilmEntry.findById(entry.film_entry_id);
    if (!currentFilmEntry)
      throw new InternalServerError(
        "Current film/diary not found in delete diary entry"
      );
    await Activity.deleteLogFilmActivity({
      subject_id: this.user_id,
      object_id: diaryEntry.film_entry_id,
    });

    const entryExists = await DiaryEntry.findOne({
      film_entry_id: { $in: this.film_entry_ids },
      _id: { $ne: entry._id },
    });

    if (!entryExists) {
      await currentFilmEntry.updateFilmEntry(null, new loggedToWatchedState());
    }

    await updateModel<
      IUserEntriesThisContext,
      IUserEntriesUpdateDiary,
      IUserEntries,
      IUserEntriesMethods
    >(this, {
      diary_entry_ids: this.diary_entry_ids.filter(
        (item) => !item._id.equals(diaryEntry._id)
      ),
    });
    return diaryEntry.deleteDiaryEntry();
  },
};

const UserEntries = mongoose.model<IUserEntriesDocument, IUserEntriesModel>(
  "UserEntries",
  userEntriesSchema
);
export default UserEntries;
