import { matchedData } from 'express-validator';
import createError from 'http-errors';
import { createResponse } from '@helpers/responseFactory';
import { OrderStore } from '@models/order.model';
import { OrderProductsStore } from '@models/order_product.model';
import { OrderProductsService } from '@services/order_product.service';
import { Request, Response, NextFunction } from 'express';
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id, role } = res.locals.user;

  const store = new OrderStore();

  try {
    if (role === 'admin') {
      const orders = await store.index();
      res.json(createResponse('success', orders));
    } else {
      const orders = await store.index(id);
      res.json(createResponse('success', orders));
    }
  } catch (e) {
    next(createError(400));
  }
};

export const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id: userId, role } = res.locals.user;
  const { id } = req.params;
  const service = new OrderProductsService();

  try {
    if (role === 'admin') {
      const orders = await service.show(id as unknown as number);
      res.json(createResponse('success', orders));
    } else {
      const order = await service.show(
        id as unknown as number,
        userId as unknown as number
      );
      if (order) {
        res.json(createResponse('success', order));
      } else {
        res.sendStatus(403);
      }
    }
  } catch (e) {
    next(createError(400));
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id: userId } = res.locals.user;
  const { products } = matchedData(req);

  const service = new OrderProductsService();

  try {
    const order = await service.create(
      userId as unknown as number,
      products as unknown as { id: number; quantity: number }[]
    );
    res.status(201).json(createResponse('success', order));
  } catch (e) {
    next(createError(400));
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id: userId } = res.locals.user;
  const { id } = req.params;
  const { products } = matchedData(req);

  const orderStore = new OrderStore();
  const store = new OrderProductsStore();

  try {
    const isUser = await orderStore.checkUser(id as unknown as number, userId);
    if (isUser) {
      await store.update(
        id as unknown as number,
        products as unknown as { id: number; quantity: number }[]
      );
      res.json(createResponse('success'));
    } else {
      next(createError(403));
    }
  } catch (e) {
    next(createError(400));
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const store = new OrderStore();

  try {
    const orders = await store.update(id as unknown as number, {
      status,
    });
    res.json(createResponse('success', orders));
  } catch (e) {
    next(createError(400));
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id: userId } = res.locals.user;
  const { id, prodId } = req.params;

  const orderStore = new OrderStore();
  const store = new OrderProductsStore();

  try {
    const isUser = await orderStore.checkUser(id as unknown as number, userId);
    if (isUser) {
      await store.delete(id as unknown as number, prodId as unknown as number);
      res.json(createResponse('success'));
    } else {
      next(createError(403));
    }
  } catch (e) {
    next(createError(400));
  }
};
