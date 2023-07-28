import { Department, KnownForDepartment, MediaType, SortBy, Languages } from "./constants";

export interface DiscoverOptions {
  page?: number;
  primary_release_year?: string;
  sort_by?: SortBy;
  with_Genres?: Genre;
  with_original_language?: Languages;
  with_companies?: number;
  with_watch_providers?: number;
}

export interface SearchOptions {
  page?: number;
  query: string;
}

export interface Movies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: BelongsToCollection;
  budget: number;
  Genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_Countries: ProductionCountry[];
  release_date: Date;
  revenue: number;
  runtime: number;
  spoken_Languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Videos;
  credits: Credits;
  alternative_titles: AlternativeTitles;
  similar: Movies;
  "watch/providers": WatchProviders;
}

export interface AlternativeTitles {
  titles: Title[];
}

export interface Title {
  iso_3166_1: string;
  title: string;
  type: string;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Credits {
  cast: Cast[];
  crew: Cast[];
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: Department;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: Department;
  job?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompanies {
  page: number;
  results: ProductionCompany[];
  total_pages: number;
  total_results: number;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Videos {
  results: Video[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  published_at: Date;
  site: string;
  size: number;
  type: string;
  official: boolean;
  id: string;
}

export interface WatchProviders {
  results: WatchProvider;
}

export interface WatchProvider {
  US: WatchOptions;
}

export interface WatchOptions {
  flatrate?: WatchOption[];
  buy?: WatchOption[];
  rent?: WatchOption[];
  free?: WatchOption[];
}

export interface WatchOption {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface PersonDetails {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday?: Date;
  deathday?: Date;
  gender: number;
  homepage: null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
  credits: Credits;
}

export interface People {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: KnownForDepartment;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  known_for: KnownFor[];
}

export interface KnownFor {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  title?: string;
  original_language: string;
  original_title?: string;
  overview: string;
  poster_path: null | string;
  media_type: MediaType;
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  name?: string;
  original_name?: string;
  first_air_date?: Date;
  origin_country?: string[];
}
