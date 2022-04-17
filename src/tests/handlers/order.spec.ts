import 'dotenv/config';
import { Product } from './../../models/product.model';
import { User } from '../../models/user.model';
import { FullOrder } from '../../services/order_product.service';

import { truncateTableUsers, prepareUsers, getTokens } from '../helpers/users';
import { truncateTableProducts, createProducts } from '../helpers/products';
import { truncateTablesOrders, createOrder } from '../helpers/orders';

import app from '../../server';
import request from 'supertest';

let accounts: User[] = [];
let products: Product[] = [];
const orders: FullOrder[] = [];

const tokens = {
  user: '',
  admin: '',
};

describe('Order api', () => {
  const agent = request(app);

  beforeAll(async () => {
    await truncateTableProducts();
    await truncateTableUsers();

    // prepare users
    accounts = await prepareUsers();

    [tokens.admin, tokens.user] = await getTokens(agent, [
      {
        email: accounts[0].email,
        password: accounts[0].password,
      },
      {
        email: accounts[1].email,
        password: accounts[1].password,
      },
    ]);

    // prepare products
    products = await createProducts(6);

    // prepare Orders
    orders.push(await createOrder(accounts[1].id as unknown as number, 3));
    orders.push(await createOrder(accounts[2].id as unknown as number, 3));
  });
  afterAll(async () => {
    await truncateTableProducts();
    await truncateTableUsers();
    await truncateTablesOrders();
  });

  it('user can create order', async () => {
    const res = await agent
      .post('/order/')
      .set({ Authorization: `Bearer ${tokens.user}` })
      .send({
        products: [
          {
            id: products[0].id,
            quantity: 107,
          },
          {
            id: products[1].id,
            quantity: 28,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.products.length).toBe(2);
    orders.push(res.body.data);
  });

  it('index orders - admin get all', async () => {
    const res = await agent
      .get('/order/')
      .set({ Authorization: `Bearer ${tokens.admin}` });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.length).toBe(orders.length);
  });

  it('index orders - user get only his orders', async () => {
    const res = await agent
      .get('/order/')
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.length).toBe(2);
  });

  it('admin can see any order', async () => {
    const order = orders[1];
    const res = await agent
      .get(`/order/${order.id}`)
      .set({ Authorization: `Bearer ${tokens.admin}` });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.id).toBe(order.id);
    expect(res.body.data.user.id).toBe(order.user.id);
  });

  it('user can see only his orders', async () => {
    let order = orders[0];
    const userRes = await agent
      .get(`/order/${order.id}`)
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(userRes.status).toBe(200);
    expect(userRes.body.status).toBe('success');
    expect(userRes.body.data.id).toBe(order.id);

    order = orders[1];
    const userRes2 = await agent
      .get(`/order/${order.id}`)
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(userRes2.status).toBe(403);
  });

  it('user can update and add order products', async () => {
    const order = orders[0];
    const res = await agent
      .patch(`/order/${order.id}`)
      .set({ Authorization: `Bearer ${tokens.user}` })
      .send({
        products: [
          {
            id: 2,
            quantity: 15,
          },
          {
            id: 4,
            quantity: 22,
          },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    orders[0].products[1].quantity = 15;
  });

  it('user cane delete order product from his order', async () => {
    const order = orders[0];
    const res = await agent
      .delete(`/order/${order.id}/4`)
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('admin can update order status', async () => {
    let order = orders[0];
    const res = await agent
      .post(`/order/${order.id}/status`)
      .set({ Authorization: `Bearer ${tokens.admin}` })
      .send({
        status: 'complete',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    order = orders[1];
    const res2 = await agent
      .post(`/order/${order.id}/status`)
      .set({ Authorization: `Bearer ${tokens.admin}` })
      .send({
        status: 'cancel',
      });
    expect(res2.status).toBe(200);
    expect(res2.body.status).toBe('success');
  });
});
