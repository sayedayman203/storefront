import { Application } from 'express';
import { checkRole } from '@middlewares/isAuth';
import {
  create,
  index,
  show,
  login,
  update,
} from '@controllers/user.controller';
import {
  updateUserValidation,
  updateAdminValidation,
  loginValidation,
  registerValidation,
} from '@validators/user.validator';
import {
  catchValidationError,
  catchValidationErrorForUpdates,
} from '@middlewares/validationError';

export const UserRoutes = (app: Application) => {
  app.post('/user/', registerValidation, catchValidationError, create);
  app.post('/user/login', loginValidation, catchValidationError, login);

  app.get('/user/', checkRole('admin'), index);

  app
    .route('/user/me')
    .all(checkRole())
    .get(show)
    .patch(updateUserValidation, catchValidationErrorForUpdates, update);
  app
    .route('/user/:id')
    .all(checkRole('admin'))
    .get(show)
    .patch(updateAdminValidation, catchValidationErrorForUpdates, update);
};
