import { check, oneOf } from 'express-validator';

export const registerValidation = [
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
  check('password')
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .bail()
    .isLength({ min: 8, max: 25 })
    .withMessage('NUMBER_MIN_8_MAX_25'),
];

export const updateUserValidation = [oneOf(registerValidation, 'NO_UPDATE')];

export const updateAdminValidation = [
  oneOf(
    [
      ...registerValidation,
      check('role').isIn(['user', 'admin']).withMessage('NOT_VALID'),
    ],
    'NO_UPDATE'
  ),
];

export const loginValidation = [
  check('email').trim().notEmpty().withMessage('REQUIRED'),
  check('password').trim().notEmpty().withMessage('REQUIRED'),
];
