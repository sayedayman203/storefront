import createError from 'http-errors';
import { createResponse } from '@helpers/responseFactory';
import { ProductStore } from '@models/product.model';
import { Request, Response, NextFunction } from 'express';

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const store = new ProductStore();
  try {
    const products = await store.index();
    res.json(createResponse('success', products));
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
  const store = new ProductStore();
  try {
    const product = await store.show(id as unknown as number);
    res.json(createResponse('success', product));
  } catch (e) {
    next(createError(404));
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, description, price } = req.body;
  const store = new ProductStore();
  try {
    const product = await store.create({
      name,
      description,
      price: price as unknown as number,
    });
    if (product[0].id) {
      res.status(201).json(createResponse('success', product[0]));
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
  const { id } = req.params;
  const body: { [key: string]: string | number } = req.body;
  const store = new ProductStore();
  try {
    if (typeof body.price === 'string') {
      body.price = parseFloat(body.price);
    }
    const product = await store.update(id as unknown as number, body);
    res.status(200).json(createResponse('success', product));
  } catch (e) {
    return next(createError(400));
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const store = new ProductStore();
  try {
    const product = await store.update(id as unknown as number, {
      deleted_at: new Date(),
    });
    res.status(200).json(createResponse('success', { id: product.id }));
  } catch (e) {
    return next(createError(404));
  }
};
