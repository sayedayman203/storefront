import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { createResponse } from '../helpers/responseFactory';

interface CustomValidationError {
  value: string;
  msg: string;
  param: string;
}

const validationResultAfterFormation = validationResult.withDefaults({
  formatter: (error: ValidationError): CustomValidationError => {
    return {
      value: error.value,
      msg: error.msg,
      param: error.param,
    };
  },
});

export const catchValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = validationResultAfterFormation(req);
  if (!result.isEmpty()) {
    res.status(400).json(createResponse('fail', result.array()));
  } else {
    next();
  }
};

export const catchValidationErrorForUpdates = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const result = validationResultAfterFormation(req);
  if (!result.isEmpty()) {
    const errors: CustomValidationError[] = result.array();

    if (errors.some((err) => err.msg === 'NO_UPDATE')) {
      return res.status(400).json(createResponse('fail', null, 'NO_UPDATES'));
    }

    return res
      .status(400)
      .json(createResponse('fail', errors, 'VALIDATION_ERROR'));
  }
  next();
};
