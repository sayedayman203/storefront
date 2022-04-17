import 'dotenv/config';
import { User } from '../../models/user.model';
import { FullOrder } from '../../services/order_product.service';
import { truncateTablesOrders, createOrder } from '../helpers/orders';
import { truncateTableProducts, createProducts } from '../helpers/products';
import { truncateTableUsers, prepareUsers } from '../helpers/users';
import { OrderProductsStore } from '../../models/order_product.model';

const orderProductsStore = new OrderProductsStore();

let accounts: User[] = [];
const orders: FullOrder[] = [];

describe('Order Products Model', () => {
  beforeAll(async () => {
    // prepare users
    accounts = await prepareUsers();

    // prepare products
    await createProducts(6);

    // prepare Orders
    orders.push(await createOrder(accounts[1].id as unknown as number, 3));
    orders.push(await createOrder(accounts[2].id as unknown as number, 3));
  });
  afterAll(async () => {
    await truncateTableUsers();
    await truncateTableProducts();
    await truncateTablesOrders();
  });

  it('should have a update method', () => {
    expect(orderProductsStore.update).toBeDefined();
  });

  it('should have an delete method', () => {
    expect(orderProductsStore.delete).toBeDefined();
  });

  it('update method should update order products', async () => {
    const result = await orderProductsStore.update(orders[0].id, [
      {
        id: 1,
        quantity: 101,
      },
      {
        id: 4,
        quantity: 102,
      },
    ]);
    expect(result.find((op) => op.product_id === 1)?.quantity).toBe(101);
    expect(result.find((op) => op.product_id === 4)?.quantity).toBe(102);
  });

  it('delete method should delete order product', async () => {
    const order = await orderProductsStore.delete(
      orders[0].id,
      orders[0].products[0].product_id
    );

    expect(order.order_id).toEqual(orders[0].id);
    expect(order.product_id).toEqual(orders[0].products[0].product_id);
  });
});
