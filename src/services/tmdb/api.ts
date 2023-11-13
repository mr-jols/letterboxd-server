import axios, { AxiosResponse } from "axios";
import { tmdb } from "./config";
import {
  MovieDetails,
  Movies,
  People,
  PersonDetails,
  ProductionCompanies,
  SearchOptions,
} from "./types";
import { Search, TimeWindow } from "./constants";

class TmdbApi {
  public static async getTrendingMovies(
    timeWindow: TimeWindow = TimeWindow.day
  ): Promise<AxiosResponse<Movies>> {
    return axios.get(tmdb.trendingMoviesUrl(timeWindow));
  }

  public static async searchMovies(
    queryOptions: SearchOptions
  ): Promise<AxiosResponse<Movies>> {
    return axios.get(tmdb.searchUrl(queryOptions, Search.movie));
  }

  public static async searchPeople(
    queryOptions: SearchOptions
  ): Promise<AxiosResponse<People>> {
    return axios.get(tmdb.searchUrl(queryOptions, Search.person));
  }

  public static async searchProductionCompanies(
    queryOptions: SearchOptions
  ): Promise<AxiosResponse<ProductionCompanies>> {
    return axios.get(tmdb.searchUrl(queryOptions, Search.company));
  }

  public static async getMovieDetails(
    id: number
  ): Promise<AxiosResponse<MovieDetails>> {
    return axios.get(tmdb.movieDetailsUrl(id));
  }

  public static async getPersonDetails(
    id: number
  ): Promise<AxiosResponse<PersonDetails>> {
    return axios.get(tmdb.personDetailsUrl(id));
  }
}

export default TmdbApi;
