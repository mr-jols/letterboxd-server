import { Router } from "express";
import AuthController from "../controllers/auth";
const authRouter = Router();

authRouter.post("/auth/sign-up", AuthController.signUp);
authRouter.post("/auth/login", AuthController.login);
authRouter.get("/auth/username-check/:username", AuthController.usernameCheck);
authRouter.get("/auth/email-check/:email", AuthController.emailCheck);
authRouter.post("/auth/refresh-token",AuthController.refreshToken);

export default authRouter;
