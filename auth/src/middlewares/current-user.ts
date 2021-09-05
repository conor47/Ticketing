import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// we are reaching into an existing type definition and make a modification
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// middleware for extracting information from jwt payload and setting it on a property in the request object.

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
