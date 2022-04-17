import 'dotenv/config';
import { User } from '../../models/user.model';
import { FullOrder } from '../../services/order_product.service';
import { truncateTablesOrders, createOrder } from '../helpers/orders';
import { truncateTableProducts, createProducts } from '../helpers/products';
import { truncateTableUsers, prepareUsers } from '../helpers/users';
import { OrderStore } from '../../models/order.model';

const orderStore = new OrderStore();

let accounts: User[] = [];
const orders: FullOrder[] = [];

describe('Order Model', () => {
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

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a update method', () => {
    expect(orderStore.update).toBeDefined();
  });

  it('should have a checkUser method', () => {
    expect(orderStore.checkUser).toBeDefined();
  });

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index();
    expect(result.length).toBe(orders.length);
    expect(result[0].status).toBe('active');
  });

  it('update method should update product', async () => {
    // complete
    const completedOrder = await orderStore.update(orders[0].id, {
      status: 'complete',
    });

    expect(completedOrder.id).toEqual(orders[0].id);
    expect(completedOrder.status).toEqual('complete');

    // cancel
    const canceledOrder = await orderStore.update(orders[1].id, {
      status: 'cancel',
    });

    expect(canceledOrder.id).toEqual(orders[1].id);
    expect(canceledOrder.status).toEqual('cancel');
  });
});
