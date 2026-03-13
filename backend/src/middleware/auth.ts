import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

export interface AuthRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token." });
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as {
      sub: string;
      email: string;
    };
    req.adminId = payload.sub;
    req.adminEmail = payload.email;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
