import { Request, Response, NextFunction } from 'express';
import { createToken } from '@helpers/jwt';
import createError from 'http-errors';
import { createResponse } from '@helpers/responseFactory';
import { UserStore, UserOPass } from '@models/user.model';

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const store = new UserStore();
  try {
    const users = await store.index();
    res.json(createResponse('success', users));
  } catch (e) {
    next(createError(400));
  }
};

export const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  let user: UserOPass;
  if (!id) {
    user = res.locals.user;
  } else {
    const store = new UserStore();
    try {
      user = await store.show(id as unknown as number);
    } catch (e) {
      return next(createError(404));
    }
  }
  if (user.password) {
    delete user.password;
  }
  res.json(createResponse('success', user));
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { first_name, last_name, email, password } = req.body;
  const store = new UserStore();
  try {
    const user = await store.create({
      first_name,
      last_name,
      email,
      password,
      role: 'user',
    });
    if (user.id) {
      res.status(201).json(createResponse('success'));
    }
  } catch (e) {
    next(createError(400));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, rememberMe = false } = req.body;
  const store = new UserStore();
  try {
    const user = await store.login(email, password);
    if (user) {
      const { token } = await createToken({ id: user.id }, rememberMe);
      if (user.password) {
        delete user.password;
      }
      res.json(createResponse('success', { token, user }));
    } else {
      next(createError(401));
    }
  } catch (e) {
    next(createError(400));
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body: { [key: string]: string } = req.body;
  let { id } = req.params;
  if (!id) {
    id = res.locals.user.id;
    if (body.role) {
      delete body.role;
    }
  }
  const store = new UserStore();
  try {
    const user = await store.update(id as unknown as number, body);
    if (user.password) {
      delete user.password;
    }
    res.status(200).json(createResponse('success', user));
  } catch (e) {
    return next(createError(400));
  }
};
