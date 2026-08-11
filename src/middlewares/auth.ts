import { NextFunction, Request, Response } from "express";
import ApiError from "../lib/ApiError";
import { verifyToken, JwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "You are not authorized. Token missing.");
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        throw new ApiError(403, "You do not have permission to perform this action.");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(new ApiError(401, "Invalid or expired token."));
    }
  };
};

export default auth;
