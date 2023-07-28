import { IFilmCreate } from "../../src/models/film/types";

class FilmData {
  public static film1: IFilmCreate= {
    title: "In the mood for love",
    poster_path: "/iYypPT4bhqXfq1b6EnmxvRt6b2Y.jpg",
    country_id: ["hk", "fr"],
    genre_id: [9648],
    language_id: "ig",
    movie_id: 834,
    popularity: 0.5,
    release_date: "jij",
    runtime: 99,
  };

  public static film2: IFilmCreate = {
    title: "Tropical malady",
    poster_path: "/idfljdof0e9refdij.jpg",
    country_id: ["hk", "ng"],
    genre_id: [9648],
    language_id: "ig",
    movie_id: 900,
    popularity: 3,
    release_date: new Date(Date.now()).toString(),
    runtime: 85,
    watch_providers: {
      buy: [8],
    },
  };

  public static film3: IFilmCreate = {
    title: "Irma vep",
    poster_path: "/idfljdof0e9refdij.jpg",
    country_id: ["hk", "ng"],
    genre_id: [9648],
    language_id: "en",
    movie_id: 500,
    popularity: 2,
    release_date: new Date(Date.now()).toString(),
    runtime: 77,
    watch_providers: {
      buy: [8],
    },
  };

  public static film4: IFilmCreate = {
    title: "closeness",
    poster_path: "/idfljdof0e9refdij.jpg",
    country_id: ["hk", "ng"],
    genre_id: [9648],
    language_id: "en",
    movie_id: 500,
    popularity: 2,
    release_date: new Date(Date.now()).toString(),
    runtime:185,
    watch_providers: {
      buy: [8],
    },
  };

  public static film5: IFilmCreate = {
    title: "The vanishing",
    poster_path: "/idfljdof0e9refdij.jpg",
    country_id: ["hk", "ng"],
    genre_id: [9648],
    language_id: "en",
    movie_id: 500,
    popularity: 2,
    release_date: new Date(Date.now()).toString(),
    runtime: 93,
    watch_providers: {
      buy: [8],
    },
  };

  public static film6: IFilmCreate = {
    title: "The seventh continent",
    poster_path: "/idfljdof0e9refdij.jpg",
    country_id: ["hk", "ng"],
    genre_id: [9648],
    language_id: "en",
    movie_id: 500,
    popularity: 2,
    release_date: new Date(Date.now()).toString(),
    runtime: 97,
    watch_providers: {
      buy: [8],
    },
  };

  public static film7: IFilmCreate = {
    title: "The lives of others",
    poster_path: "/idfljdof0e9refdij.jpg",
    country_id: ["hk", "ng"],
    genre_id: [9648],
    language_id: "en",
    movie_id: 500,
    popularity: 2,
    release_date: new Date(Date.now()).toString(),
    runtime: 136,
    watch_providers: {
      buy: [8],
    },
  };
}

export default FilmData;
