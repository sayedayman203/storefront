import { Request, Response, NextFunction } from 'express';
import { UserStore, User } from '@models/user.model';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check token
    const header = req.header('Authorization');
    if (header) {
      const token = header.replace('Bearer ', '');
      if (!token) throw new Error();
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as unknown as string
      );

      // check user
      const user = await new UserStore().show(
        (decodedToken as unknown as { [key: string]: unknown }).id as number
      );
      if (!user) throw new Error();
      // set user to be avilable to full request-response cycle if needed
      res.locals.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    next();
  }
};

export const checkRole =
  (role: User['role'] | User['role'][] = ['user', 'admin']) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (
      (Array.isArray(role) && role.includes(res.locals.user?.role)) ||
      res.locals.user?.role === role
    ) {
      return next();
    }
    next(createError(401, 'UNAUTHORIZED'));
  };
