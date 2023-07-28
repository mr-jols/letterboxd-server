import { type Response, type NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors/errors";
import { JwtUtil } from "../utils/jwt";
import { ErrorHandler } from "../utils/errors/functions";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function authMiddleware(req: any, res: Response, next: NextFunction): any {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return ErrorHandler(res, new UnauthorizedError("Unauthorized"));
    try {
        const payload = JwtUtil.verifyAccessToken(token);
        req.id = payload.id;
        next();
    } catch (error) {
        return ErrorHandler(res, error as Error);
    }
}