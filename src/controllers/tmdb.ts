/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-for-in-array */
import { type Response, type Request } from "express";
import { ErrorHandler } from "../utils/errors/functions";
import TmdbApi from "../services/tmdb/api";
import {
  SuccessHandler,
  convertGenreIdToGenre,
  formatReleaseDateByYear,
  isInEnum,
  isPage,
  isString,
} from "../utils/functions";
import { BadRequestError } from "../utils/errors/errors";
import {
  Cast,
  Movie,
  MovieDetails,
  Movies,
  People,
  ProductionCompany,
  Videos,
} from "../services/tmdb/types";
import { Genres, Languages, TimeWindow } from "../services/tmdb/constants";
import { format, isValid } from "date-fns";
import { release } from "os";

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
            genres:
              genre_ids?.map((item: any) => convertGenreIdToGenre(item)) ?? [],
            release_date: formatReleaseDateByYear(release_date),
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

  public static async getMovieWithLongestSynopsis(
    req: Request,
    res: Response
  ): Promise<any> {
    let largest: [string, number, string] = ["", 0, ""];
    for (let i = 4700; i <= 80000; i++) {
      console.log(i);
      try {
        const {
          overview,
          title,
          id,
          // eslint-disable-next-line no-await-in-loop
        } = (await TmdbApi.getMovieDetails(i)).data;
        if (overview.length > largest[0].length) {
          console.log(`count- ${overview.length} id- ${id} Title:- ${title}`);
          largest = [overview, id, title];
        }
      } catch (err) {}
    }

    return SuccessHandler(res, {
      message: `${largest[2]} with id ${largest[1]} has the longest synpopsis on tmdb with ${largest[0].length} characters`,
    });
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
      const {
        release_date,
        videos,
        credits: { cast, crew },
        production_companies,
        production_countries,
        original_language,
        alternative_titles,
        ...rest
      } = (await TmdbApi.getMovieDetails(Number(id))).data;
      return SuccessHandler(res, <{ result: Partial<MovieDetails> }>{
        result: {
          release_date: formatReleaseDateByYear(release_date),
          trailer: getTrailerFromVideos(videos),
          directorName: crew
            .filter((item) => item.job === Jobs.director)
            .map((item) => item.name)
            .join(", "),
          credits: {
            cast,
            crew: crew
              .filter((item) => Object.values(Jobs).includes(item?.job ?? "-1"))
              .sort((a, b) => {
                if (!a.job || !b.job) return 1;
                let result = sortByStringEquality(a.job, b.job, Jobs.director);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.producer);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.writer);
                if (result !== 0) return result;
                result = sortByStringEquality(
                  a.job,
                  b.job,
                  Jobs.writerScreenplay
                );
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.editor);
                if (result !== 0) return result;
                result = sortByStringEquality(
                  a.job,
                  b.job,
                  Jobs.cinematographer
                );
                if (result !== 0) return result;
                result = sortByStringEquality(
                  a.job,
                  b.job,
                  Jobs.productionDesigner
                );
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.artDirection);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.composer);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.musicComposer);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.soundEditor);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.soundDesign);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.soundEffects);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.soundMixer);
                if (result !== 0) return result;
                result = sortByStringEquality(
                  a.job,
                  b.job,
                  Jobs.soundRecordist
                );
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.costumeDesign);
                if (result !== 0) return result;
                result = sortByStringEquality(
                  a.job,
                  b.job,
                  Jobs.visualEffectProducer
                );
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.setDecoration);
                if (result !== 0) return result;
                result = sortByStringEquality(a.job, b.job, Jobs.makeUp);
                if (result !== 0) return result;
                return result;
              })
              .map((item) => {
                if (item.job === Jobs.cinematographer)
                  return { ...item, job: "Cinematographer" };
                if (item.job === Jobs.soundDesign)
                  return { ...item, job: "Sound" };
                if (item.job === Jobs.soundEditor)
                  return { ...item, job: "Sound" };
                if (item.job === Jobs.soundEffects)
                  return { ...item, job: "Sound" };
                if (item.job === Jobs.soundMixer)
                  return { ...item, job: "Sound" };
                if (item.job === Jobs.soundRecordist)
                  return { ...item, job: "Sound" };
                if (item.job === Jobs.composer)
                  return { ...item, job: "Composer" };
                if (item.job === Jobs.musicComposer)
                  return { ...item, job: "Composer" };
                if (item.job === Jobs.writerScreenplay)
                  return { ...item, job: "Writer" };
                if (item.job === Jobs.costumeDesign)
                  return { ...item, job: "Costumes" };
                return item;
              }),
          },
          studios: production_companies.map((item) => ({
            id: item.id,
            name: item.name,
          })),
          countries: production_countries.map((item) => ({
            id: item.iso_3166_1,
            name: item.name,
          })),
          original_language: {
            id: original_language,
            name: Object.keys(Languages)[
              Object.values(Languages).indexOf(original_language as any)
            ],
          } as any,
          alternative_titles: alternative_titles.titles.map(
            (item) => item.title
          ) as any,
          ...rest,
        },
      });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async searchPeople(req: Request, res: Response): Promise<any> {
    try {
      const { query, page } = req.query;
      const isPageValid = isPage(page);
      const isQueryValid = isString(query);
      const tmdbResponse = (
        await TmdbApi.searchPeople({
          query: isQueryValid ? query : ("" as any),
          page: isPageValid ? page : (1 as any),
        })
      ).data;
      return SuccessHandler(res, <People>{
        ...tmdbResponse,
        results: tmdbResponse.results.sort(
          (a, b) => b.popularity - a.popularity
        ),
      });
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

  public static async getPersonDetails(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const isIdValid = !isNaN(Number(req.params.id));
      if (!isIdValid)
        return ErrorHandler(res, new BadRequestError("Invalid Movie id"));
      const { id, name, biography, profile_path, credits } = (
        await TmdbApi.getPersonDetails(Number(req.params.id))
      ).data;
      const accumulator: { [key: string]: Cast[] } = {};
      return SuccessHandler(res, {
        id,
        name,
        ...credits.crew.sort(
          (a, b) => b.popularity - a.popularity
        ).reduce((acc, val) => {
          console.log(acc[val?.job ?? ""]);
          if (acc[val?.job ?? "misc"])
            acc[val?.job ?? "misc"] =
              acc[val?.job ?? "misc"]?.concat(val) ?? acc.misc.concat(val);
          else acc[val?.job ?? "misc"] = [val];
          return acc;
        }, accumulator),
      });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }
}

function getTrailerFromVideos(videos?: Videos): string | null {
  if (!((videos?.results?.length ?? -1) > 0)) return null;
  const trailers = videos!.results;
  for (const i in trailers) {
    if (trailers[i].site.toLowerCase() === "youtube") return trailers[i].key;
  }
  return null;
}

const Jobs = {
  director: "Director",
  producer: "Producer",
  writer: "Writer",
  writerScreenplay: "Screenplay",
  editor: "Editor",
  cinematographer: "Director of Photography",
  productionDesigner: "Production Design",
  artDirection: "Art Direction",
  composer: "Original Music Composer",
  musicComposer: "Music",
  soundEditor: "Sound Editor",
  soundDesign: "Sound Designer",
  soundEffects: "Sound Effects",
  soundMixer: "Sound Mixer",
  soundRecordist: "Sound Recordist",
  costumeDesign: "Costume Design",
  setDecoration: "Set Decoration",
  makeUp: "Makeup Artist",
  visualEffectProducer: "Visual Effects Producer",
};

function sortByStringEquality(a: string, b: string, val: string): 1 | -1 | 0 {
  if (a === val && b !== val) return -1;
  if (a !== val && b === val) return 1;
  return 0;
}
