import 'dotenv/config';
import { truncateTableUsers, prepareUsers, getTokens } from '../helpers/users';
import { User } from './../../models/user.model';
import { truncateTableProducts, createProducts } from '../helpers/products';
import { Product } from './../../models/product.model';
import app from '../../server';
import request from 'supertest';

let accounts: User[] = [];

let products: Product[] = [];

const tokens = {
  user: '',
  admin: '',
};

describe('Product api', () => {
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
    products = await createProducts(3);
  });
  afterAll(async () => {
    await truncateTableProducts();
    await truncateTableUsers();
  });

  it('admin can create product', async () => {
    const newProd: Product = {
      name: 'new prod',
      description: 'new prod for testing',
      price: 182,
    };
    // admin
    const res = await agent
      .post('/product/')
      .set({ Authorization: `Bearer ${tokens.admin}` })
      .send(newProd);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.id).toBeDefined();
    newProd.id = res.body.data.id;
    products.push(newProd);
  });

  it("user can't create product", async () => {
    const userRes = await agent
      .post('/product')
      .set({ Authorization: `Bearer ${tokens.user}` })
      .send({
        name: 'Product 89',
        description: 'words to fill description',
        price: 15.69,
      });
    expect(userRes.status).toBe(401);
  });

  it('admin can update Product', async () => {
    const prod = products[0];
    const adminRes = await agent
      .patch(`/product/${prod.id}`)
      .set({ Authorization: `Bearer ${tokens.admin}` })
      .send({
        price: 12.13,
      });
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(prod.id);
    expect(adminRes.body.data.price).toBe(12.13);
    products[0].price = 12.13;
  });

  it("user can't update Product", async () => {
    const prod = products[0];
    const userRes = await agent
      .patch(`/product/${prod.id}`)
      .set({ Authorization: `Bearer ${tokens.user}` })
      .send({
        price: 13.12,
      });
    expect(userRes.status).toBe(401);
  });

  it('admin and user can see products', async () => {
    // admin
    const adminRes = await agent
      .get('/product/')
      .set({ Authorization: `Bearer ${tokens.admin}` });
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.length).toBe(products.length);

    // user
    const userRes = await agent
      .get('/product/')
      .set({ Authorization: `Bearer ${tokens.user}` });
    expect(userRes.status).toBe(200);
    expect(userRes.body.status).toBe('success');
    expect(userRes.body.data.length).toBe(products.length);
  });

  it('admin and user can see product', async () => {
    const prod = products[1];
    // admin
    const adminRes = await agent
      .get(`/product/${prod.id}`)
      .set({ Authorization: `Bearer ${tokens.admin}` });
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(prod.id);
    // user
    const userRes = await agent
      .get(`/product/${prod.id}`)
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(userRes.status).toBe(200);
    expect(userRes.body.status).toBe('success');
    expect(userRes.body.data.id).toBe(prod.id);
  });

  it('admin can soft delete product', async () => {
    const prod = products[2];

    const adminRes = await agent
      .delete(`/product/${prod.id}`)
      .set({ Authorization: `Bearer ${tokens.admin}` });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
  });

  it("user can't soft delete product", async () => {
    const prod = products[3];
    const userRes = await agent
      .delete(`/product/${prod.id}`)
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(userRes.status).toBe(401);
  });
});
