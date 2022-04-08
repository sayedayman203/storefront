import 'dotenv/config';
import { truncateTable, prepare } from './helpers/products';
import { prepare as prepareUsers, login } from './helpers/users';
import { ProductStore } from '../models/product.model';
import app from '../server';
import request from 'supertest';

const store = new ProductStore();

describe('Product Model', () => {
  beforeEach(prepare);
  afterAll(truncateTable);

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'myProduct',
      description: 'my own product',
      price: 70.89,
    });
    expect(result[0].id).toBe(6);
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result.length).toBe(5);
    expect(result[0].name).toMatch('product 1');
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(3);
    expect(result.id).toBe(3);
    expect(result.name).toMatch('product 3');
  });

  it('update method should update product', async () => {
    const product = await store.update(3, {
      name: 'New name for prooduct',
    });

    expect(product.id).toEqual(3);
    expect(product.name).toEqual('New name for prooduct');
  });
});

// describe('Product api', () => {
//   const agent = request(app);
//   let userToken = '';
//   let adminToken = '';
//   beforeAll(async () => {
//     await prepareUsers();
//     await ['user', 'admin'].map(async (type) => {
//       const { token } = await login(agent, type as unknown as 'user' | 'admin');
//       switch (type) {
//         case 'user': {
//           userToken = `Bearer ${token}`;
//           break;
//         }
//         case 'admin': {
//           adminToken = `Bearer ${token}`;
//           break;
//         }
//       }
//     });
//   });
//   beforeEach(prepare);
//   afterAll(truncateTable);

//   it("admin can create product - user can't", async () => {
//     // admin
//     const adminRes = await agent
//       .post('/product')
//       .set({ Authorization: adminToken })
//       .send({
//         name: 'Product 88',
//         description: 'words to fill description',
//         price: 15.99,
//       });
//     expect(adminRes.status).toBe(201);
//     expect(adminRes.body.status).toBe('success');

//     // user
//     const userRes = await agent
//       .post('/product')
//       .set({ Authorization: userToken })
//       .send({
//         name: 'Product 89',
//         description: 'words to fill description',
//         price: 15.69,
//       });
//     expect(userRes.status).toBe(401);
//   });

//   it("admin can update Product - user can't", async () => {
//     // admin
//     const adminRes = await agent
//       .patch('/product/2')
//       .set({ Authorization: adminToken })
//       .send({
//         price: 55.19,
//       });
//     expect(adminRes.status).toBe(200);
//     expect(adminRes.body.status).toBe('success');
//     expect(adminRes.body.data.id).toBe(2);
//     expect(adminRes.body.data.price).toBe(55.19);

//     // user
//     const userRes = await agent
//       .patch('/product/2')
//       .set({ Authorization: userToken })
//       .send({
//         price: 55.69,
//       });
//     expect(userRes.status).toBe(401);
//   });

//   it('admin and user can see products', async () => {
//     // admin
//     const adminRes = await agent
//       .get('/product/')
//       .set({ Authorization: adminToken });

//     expect(adminRes.status).toBe(200);
//     expect(adminRes.body.status).toBe('success');
//     expect(adminRes.body.length).toBeGreaterThan(1);
//     // user
//     const userRes = await agent
//       .get('/product/')
//       .set({ Authorization: userToken });

//     expect(userRes.status).toBe(200);
//     expect(userRes.body.status).toBe('success');
//     expect(userRes.body.length).toBeGreaterThan(1);
//   });

//   it('admin and user can see product', async () => {
//     // admin
//     const adminRes = await agent
//       .get('/product/2')
//       .set({ Authorization: adminToken });

//     expect(adminRes.status).toBe(200);
//     expect(adminRes.body.status).toBe('success');
//     expect(adminRes.body.data.id).toBe(2);
//     // user
//     const userRes = await agent
//       .get('/product/4')
//       .set({ Authorization: userToken });

//     expect(userRes.status).toBe(200);
//     expect(userRes.body.status).toBe('success');
//     expect(userRes.body.data.id).toBe(4);
//   });

//   it("admin can soft delete product - user can't", async () => {
//     // admin
//     const adminRes = await agent
//       .delete('/product/3')
//       .set({ Authorization: adminToken });

//     expect(adminRes.status).toBe(200);
//     expect(adminRes.body.status).toBe('success');

//     // user
//     const userRes = await agent
//       .delete('/product/4')
//       .set({ Authorization: userToken });

//     expect(userRes.status).toBe(401);
//   });
// });
