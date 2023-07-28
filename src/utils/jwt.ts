import jwt from "jsonwebtoken";
import CONFIG from "../config";

interface JwtPayloadType {
  id: string;
}

export class JwtUtil {
  public static generateAccessToken(payload: JwtPayloadType): string {
    if (typeof CONFIG.auth.jwtAccessTokenSecret !== "string")
      throw Error("Invalid jwt secret");
    if (typeof CONFIG.auth.jwtAccessTokenExpirationInterval !== "string")
      throw Error("Invalid jwt expiration interval");
    console.log(CONFIG.auth.jwtAccessTokenExpirationInterval);
    return jwt.sign(payload, CONFIG.auth.jwtAccessTokenSecret, {
      expiresIn: CONFIG.auth.jwtAccessTokenExpirationInterval,
    });
  }

  public static verifyAccessToken(token: string): any {
    if (typeof CONFIG.auth.jwtAccessTokenSecret !== "string")
      throw Error("Invalid jwt secret");
    return jwt.verify(token, CONFIG.auth.jwtAccessTokenSecret);
  }

  public static generateRefreshToken(payload: JwtPayloadType): string {
    if (typeof CONFIG.auth.jwtRefreshTokenSecret !== "string")
      throw Error("Invalid jwt secret");
    if (typeof CONFIG.auth.jwtRefreshTokenExpirationInterval !== "string")
      throw Error("Invalid jwt expiration interval");
    console.log(CONFIG.auth.jwtRefreshTokenExpirationInterval);
    return jwt.sign(payload, CONFIG.auth.jwtRefreshTokenSecret, {
      expiresIn: CONFIG.auth.jwtRefreshTokenExpirationInterval,
    });
  }

  public static verifyRefreshToken(token: string): any {
    if (typeof CONFIG.auth.jwtRefreshTokenSecret !== "string")
      throw Error("Invalid jwt secret");
    return jwt.verify(token, CONFIG.auth.jwtRefreshTokenSecret);
  }
}
