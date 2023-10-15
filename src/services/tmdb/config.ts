/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable prefer-arrow-callback */
import axios, { AxiosError } from "axios";
import { queryToString } from "../../utils/functions";
import { Search, TimeWindow } from "./constants";
import { DiscoverOptions, SearchOptions } from "./types";

axios.interceptors.request.use(
  function (config) {
    console.log(config.url);
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error:AxiosError) {
    console.log("error occured here",error.message);
    if(error.message==="Socket connection timeout")
    return axios.request(error.config!);
    return Promise.reject(error);
  }
);

class TmdbApiConfig {
  private static _instance: TmdbApiConfig;
  private readonly _apiKey: string;
  private readonly _baseUrl: string;

  private constructor(_baseUrl: string, _apikey: string) {
    this._apiKey = _apikey;
    this._baseUrl = _baseUrl;
  }

  public static getInstance(
    _baseUrl?: string,
    _apiKey?: string
  ): TmdbApiConfig {
    if (!TmdbApiConfig._instance) {
      if (Boolean(_baseUrl) || Boolean(_apiKey))
        TmdbApiConfig._instance = new TmdbApiConfig(_baseUrl!, _apiKey!);
      else
        throw new Error(
          "Api key and Base Url must be added to first call of getInstance"
        );
    }
    return TmdbApiConfig._instance;
  }

  public movieDetailsUrl(id: number): string {
    return this._getEndpoint(TmdbApiEndpoint.movieDetail(id), {
      append_to_response:
        "videos,credits,alternative_titles,similar,watch/providers,recommendations",
    });
  }

  public personDetailsUrl(id: number): string {
    return this._getEndpoint(TmdbApiEndpoint.personDetail(id), {
      append_to_response: "credits",
    });
  }

  public trendingMoviesUrl(time_window: TimeWindow): string {
    return this._getEndpoint(TmdbApiEndpoint.trendingMovies(time_window));
  }

  public discoverMoviesUrl(queryOptions?: DiscoverOptions): string {
    return this._getEndpoint(TmdbApiEndpoint.discoverMovies, queryOptions);
  }

  public searchUrl(queryOptions: SearchOptions, searchType: Search): string {
    return this._getEndpoint(TmdbApiEndpoint.search(searchType), queryOptions);
  }

  private _getEndpoint(endpoint: string, queryOptions?: any): string {
    return `${this._baseUrl}/${endpoint}?api_key=${this._apiKey}${
      queryOptions ? `&${queryToString(queryOptions)}` : ""
    }`;
  }
}

export const tmdb = TmdbApiConfig.getInstance(
  "https://api.themoviedb.org/3",
  "2301a07e48f15e1d8919f1e5909551af"
);

const TmdbApiEndpoint = {
  trendingMovies: (timeWindow: TimeWindow): string =>
    `trending/movie/${timeWindow}`,
  search: (searchType: Search): string => `search/${searchType}`,
  movieDetail: (id: number): string => `movie/${id}`,
  personDetail: (id: number): string => `person/${id}`,
  discoverMovies: "discover/movie",
};
