import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get user session
    const session = await betterAuth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // session validation
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No session found!",
      });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Email not verified!",
      });
    }

    const { id, email, name, role, emailVerified } = session.user;

    // set user in request
    req.user = { id, email, name, role: role!, emailVerified };

    // check for roles
    if (roles.length && !roles.includes(role as Role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You don't have permissions to access this resource!",
      });
    }

    next();
  };
};

export default auth;
