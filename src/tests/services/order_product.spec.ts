import { Product } from './../../models/product.model';
import 'dotenv/config';
import { User } from '../../models/user.model';
import {
  FullOrder,
  OrderProductsService,
} from '../../services/order_product.service';
import { truncateTablesOrders, createOrder } from '../helpers/orders';
import { truncateTableProducts, createProducts } from '../helpers/products';
import { truncateTableUsers, prepareUsers } from '../helpers/users';

const orderProductsService = new OrderProductsService();

let accounts: User[] = [];
let products: Product[] = [];
const orders: FullOrder[] = [];

describe('Order Products Service', () => {
  beforeAll(async () => {
    // prepare users
    accounts = await prepareUsers();

    // prepare products
    products = await createProducts(6);

    // prepare Orders
    orders.push(await createOrder(accounts[1].id as unknown as number, 3));
    orders.push(await createOrder(accounts[2].id as unknown as number, 3));
  });
  afterAll(async () => {
    await truncateTableUsers();
    await truncateTableProducts();
    await truncateTablesOrders();
  });

  it('should have a show method', () => {
    expect(orderProductsService.show).toBeDefined();
  });

  it('should have an create method', () => {
    expect(orderProductsService.create).toBeDefined();
  });

  it('create method should create order with products', async () => {
    const result = await orderProductsService.create(
      accounts[accounts.length - 1].id as unknown as number,
      [
        {
          id: products[0].id as unknown as number,
          quantity: 65,
        },
        {
          id: products[2].id as unknown as number,
          quantity: 14,
        },
        {
          id: products[5].id as unknown as number,
          quantity: 22,
        },
      ]
    );
    expect(result.id).toBeDefined();
    expect(result.products.length).toBe(3);
    orders.push(result);
  });

  it('show method should show full order with product and can match for specific user', async () => {
    const order = await orderProductsService.show(orders[0].id);
    expect(order.id).toEqual(orders[0].id);
    expect(order.products.length).toEqual(orders[0].products.length);

    const user_order = await orderProductsService.show(
      orders[2].id,
      orders[2].user.id
    );

    expect(user_order.id).toEqual(orders[2].id);
    expect(user_order.products.length).toEqual(orders[2].products.length);
  });
});
