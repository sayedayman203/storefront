import { check } from 'express-validator';

export const productValidation = [
  check('first_name')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ min: 3, max: 15 })
    .withMessage('TEXT_MIN_3_MAX_15'),
  check('last_name')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ min: 3, max: 15 })
    .withMessage('TEXT_MIN_3_MAX_15'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('TEXT_MIN_3_MAX_255'),
  check('phone')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ min: 6, max: 50 })
    .withMessage('TEXT_MIN_6_MAX_50'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ min: 8, max: 25 })
    .withMessage('NUMBER_MIN_8_MAX_25'),
];

export const loginValidation = [
  check('email').trim().notEmpty().withMessage('REQUIRED'),
  check('password').trim().notEmpty().withMessage('REQUIRED'),
];
