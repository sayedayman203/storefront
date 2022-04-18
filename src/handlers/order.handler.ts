import { Application } from 'express';
import {
  orderProductsValidation,
  updateStatusValidation,
} from '@validators/order.validator';
import {
  catchValidationError,
  //   catchValidationErrorForUpdates,
} from '@middlewares/validationError';
import { checkRole } from '@middlewares/isAuth';
import {
  create,
  index,
  show,
  updateOrder,
  updateStatus,
  deleteProduct,
} from '@controllers/order.controller';
export const OrderRoutes = (app: Application) => {
  app
    .route('/order/')
    .get(checkRole(), index)
    .post(
      checkRole('user'),
      orderProductsValidation,
      catchValidationError,
      create
    );

  app
    .route('/order/:id')
    .get(checkRole(), show)
    .patch(
      checkRole('user'),
      orderProductsValidation,
      catchValidationError,
      updateOrder
    );

  app
    .route('/order/:id/status')
    .post(
      checkRole('admin'),
      updateStatusValidation,
      catchValidationError,
      updateStatus
    );

  app.route('/order/:id/:prodId').delete(checkRole('user'), deleteProduct);
};
