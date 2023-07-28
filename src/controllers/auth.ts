import { Request, Response } from "express";
import User from "../models/user/index";
import { Error } from "mongoose";
import { JwtUtil } from "../utils/jwt";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../utils/errors/errors";
import { ErrorHandler } from "../utils/errors/functions";
import { SuccessHandler } from "../utils/functions";

class AuthController {
  public static async signUp(req: Request, res: Response): Promise<any> {
    try {
      const user = new User(req.body);
      if (user.username && user.email) {
        const existingUser = await User.findOne({
          $or: [{ username: user.username }, { email: user.email }],
        });
        if (existingUser)
          return ErrorHandler(
            res,
            new ConflictError("Username or email exists")
          );
      }
      const savedUser = await User.createUser(user);
      await savedUser.initialize();
      const accessToken = JwtUtil.generateAccessToken({ id: user._id });
      const refreshToken = JwtUtil.generateRefreshToken({ id: user._id });
      const readUser = await savedUser.readUser();

      return SuccessHandler(res, {
        message: "User created",
        ...readUser,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async login(req: Request, res: Response): Promise<any> {
    try {
      const { usernameOrEmail, password } = req.body;
      if (!usernameOrEmail)
        return ErrorHandler(
          res,
          new BadRequestError("Username or Email is required")
        );
      if (!password)
        return ErrorHandler(res, new BadRequestError("Password is required"));

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!user)
        return ErrorHandler(res, new UnauthorizedError("Invalid credentials"));

      const isAuthenticated = user.authenticate(password);
      if (!isAuthenticated)
        return ErrorHandler(res, new UnauthorizedError("Invalid credentials"));

      const accessToken = JwtUtil.generateAccessToken({ id: user._id });
      const refreshToken = JwtUtil.generateRefreshToken({ id: user._id });

      return res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async usernameCheck(req: Request, res: Response): Promise<any> {
    try {
      const { username } = req.params;
      const message = (await User.countDocuments({ username })) > 0;
      return SuccessHandler(res, { message });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static async emailCheck(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.params;
      const message = (await User.countDocuments({ email })) > 0;
      return res.status(200).json({ message });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }

  public static refreshToken(req: Request, res: Response): any {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return ErrorHandler(
          res,
          new BadRequestError("Refresh token is required")
        );
      const id = JwtUtil.verifyRefreshToken(refreshToken);
      const newAccessToken = JwtUtil.generateAccessToken({ id });
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      return ErrorHandler(res, err as Error);
    }
  }
}

export default AuthController;
