import { check, oneOf } from 'express-validator';

export const productValidation = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ max: 255 })
    .withMessage('TEXT_MAX_255'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ max: 500 })
    .withMessage('TEXT_MAX_500'),
  check('price')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isFloat({
      min: 0,
    })
    .withMessage('NUMBER_MIN_0'),
];

export const updateProduct = [oneOf(productValidation, 'NO_UPDATE')];
