import { updateAdminValidation } from './../validators/user.validator';
import { updateUserValidation } from '@validators/user.validator';
import {
  catchValidationError,
  catchValidationErrorForUpdates,
} from '@middlewares/validationError';
import { checkRole } from '@middlewares/isAuth';
import {
  create,
  index,
  show,
  login,
  update,
} from '@controllers/user.controller';
import { Application } from 'express';
import {
  loginValidation,
  registerValidation,
} from '@validators/user.validator';
export const UserRoutes = (app: Application) => {
  app.post('/user/login', loginValidation, catchValidationError, login);
  app.post('/user/', registerValidation, catchValidationError, create);

  app.get('/user/', checkRole('admin'), index);

  app
    .route('/user/me')
    .all(checkRole(['user', 'admin']))
    .get(show)
    .patch(updateUserValidation, catchValidationErrorForUpdates, update);
  app
    .route('/user/:id')
    .all(checkRole('admin'))
    .get(show)
    .patch(updateAdminValidation, catchValidationErrorForUpdates, update);
};
