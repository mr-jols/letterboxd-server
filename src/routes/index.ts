import { type Response, type Request, Router } from "express";
import { TmdbController } from "../controllers/tmdb";
import { ErrorHandler } from "../utils/errors/functions";
import { NotFoundError } from "../utils/errors/errors";
import authRouter from "./auth";
import DiaryController from "../controllers/diary";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", (_: Request, res: Response) =>
  res.send("Forget it jake, it's chinatown")
);

router.use(authRouter);

router.get("/tmdb/trending-movies", TmdbController.getTrendingMovies);
router.get("/tmdb/search-movies", TmdbController.searchMovies);
router.get("/tmdb/search-people", TmdbController.searchPeople);
router.get("/tmdb/search-companies", TmdbController.searchProductionCompanies);
router.get("/tmdb/movie/:id", TmdbController.getMovieDetails);
router.get("/tmdb/person/:id", TmdbController.getPersonDetails);

router.post("/users/:userId/diary", DiaryController.addEntry);

router.all("*", (_: Request, res: Response) =>
  ErrorHandler(res, new NotFoundError("Route not found"))
);

export default router;
