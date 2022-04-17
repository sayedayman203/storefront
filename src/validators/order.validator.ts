import { check } from 'express-validator';

export const orderProductsValidation = [
  check('products.*.id')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isInt({ min: 1 })
    .withMessage('NUMBER_MIN_1'),
  check('products.*.quantity')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isInt({ min: 1 })
    .withMessage('NUMBER_MIN_1'),
];

export const updateStatusValidation = [
  check('status').isIn(['complete', 'cancel']).withMessage('NOT_VALID'),
];
