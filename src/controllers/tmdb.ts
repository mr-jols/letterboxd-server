import { type Response, type Request } from "express";
import { ErrorHandler } from "../utils/errors/functions";
import TmdbApi from "../services/tmdb/api";
import {
  SuccessHandler,
  convertGenreIdToGenre,
  isInEnum,
  isPage,
  isString,
} from "../utils/functions";
import { BadRequestError } from "../utils/errors/errors";
import { Movie, Movies } from "../services/tmdb/types";
import { Genres, TimeWindow } from "../services/tmdb/constants";
import { format, isValid } from "date-fns";

export class TmdbController {
  public static async getTrendingMovies(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const { time_window } = req.query;
      const isTimeWindowValid = isInEnum(time_window, TimeWindow);
      const trendingMovies = await (isTimeWindowValid
        ? TmdbApi.getTrendingMovies(time_window as any)
        : TmdbApi.getTrendingMovies());
      return res.status(200).json({
        results: trendingMovies.data.results.map(
          (item): Pick<Movie, "id" | "poster_path"> => ({
            id: item.id,
            poster_path: item.poster_path,
          })
        ),
      });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async searchMovies(req: Request, res: Response): Promise<any> {
    try {
      const { query, page } = req.query;
      const isPageValid = isPage(page);
      const isQueryValid = isString(query);
      const tmdbResponse = (
        await TmdbApi.searchMovies({
          query: isQueryValid ? query : ("" as any),
          page: isPageValid ? page : (1 as any),
        })
      ).data;
      return SuccessHandler(res, {
        ...tmdbResponse,
        results: tmdbResponse.results
          .map(({ genre_ids, release_date, ...rest }) => ({
            genres: genre_ids?.map((item: any) => convertGenreIdToGenre(item)) ?? [],
            release_date: isValid(new Date(release_date))
              ? format(new Date(release_date), "yyyy")
              : null,
            ...rest,
          }))
          .sort((a, b) => {
            const aContainsSubstring =
              a.title.toLowerCase().includes((query as string).toLowerCase()) ||
              a.original_title
                .toLowerCase()
                .includes((query as string).toLowerCase());
            const bContainsSubstring =
              b.title.toLowerCase().includes((query as string).toLowerCase()) ||
              b.original_title
                .toLowerCase()
                .includes((query as string).toLowerCase());

            if (aContainsSubstring && !bContainsSubstring) {
              return -1;
            } else if (!aContainsSubstring && bContainsSubstring) {
              return 1;
            }
            return b.vote_count - a.vote_count;
          }),
      });
    } catch (err) {
      console.log(err);
      return ErrorHandler(res, err as Error);
    }
  }

  public static async searchPeople(req: Request, res: Response): Promise<any> {
    try {
      const { query, page } = req.query;
      const isPageValid = isPage(page);
      const isQueryValid = isString(query);
      const result = await TmdbApi.searchPeople({
        query: isQueryValid ? query : ("" as any),
        page: isPageValid ? page : (1 as any),
      });
      return res.status(200).json(result.data);
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async searchProductionCompanies(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const { query, page } = req.query;
      const isPageValid = isPage(page);
      const isQueryValid = isString(query);
      const result = await TmdbApi.searchProductionCompanies({
        query: isQueryValid ? query : ("" as any),
        page: isPageValid ? page : (1 as any),
      });
      return res.status(200).json(result.data);
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async getMovieDetails(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const { id } = req.params;
      const isIdValid = !isNaN(Number(id));
      if (!isIdValid)
        return ErrorHandler(res, new BadRequestError("Invalid Movie id"));
      const result = await TmdbApi.getMovieDetails(Number(id));
      return res.status(200).json(result.data);
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async getPersonDetails(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const { id } = req.params;
      const isIdValid = !isNaN(Number(id));
      if (!isIdValid)
        return ErrorHandler(res, new BadRequestError("Invalid Movie id"));
      const result = await TmdbApi.getPersonDetails(Number(id));
      return res.status(200).json(result.data);
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }
}
