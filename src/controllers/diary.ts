import mongoose from "mongoose";
import { ErrorHandler } from "../utils/errors/functions";
import { BadRequestError, NotFoundError } from "../utils/errors/errors";
import { Request, Response } from "express";
import DiaryEntry from "../models/diary_entry/index";

class DiaryController {
  public static async addEntry(req: Request, res: Response): Promise<any> {
    try {
      const { user_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(user_id))
        return ErrorHandler(res, new NotFoundError("User not found"));
      const diary = new DiaryEntry({ ...req.body, user: user_id });
      try {
        await diary.save();
      } catch (err) {
        return ErrorHandler(res, err as Error);
      }
      // const userDiary = await DiaryEntry.findByUserId(diary.user_id);
      res.status(200).json({ results:[] });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }
}

export default DiaryController;
