import { Application } from 'express';
import {
  productValidation,
  updateProduct,
} from '@validators/product.validator';
import {
  catchValidationError,
  catchValidationErrorForUpdates,
} from '@middlewares/validationError';
import { checkRole } from '@middlewares/isAuth';
import {
  create,
  index,
  show,
  update,
  deleteProduct,
} from '@controllers/product.controller';
export const ProductRoutes = (app: Application) => {
  app
    .route('/product/')
    .get(index)
    .post(checkRole('admin'), productValidation, catchValidationError, create);

  app
    .route('/product/:id')
    .get(show)
    .patch(
      checkRole('admin'),
      updateProduct,
      catchValidationErrorForUpdates,
      update
    )
    .delete(checkRole('admin'), deleteProduct);
};
