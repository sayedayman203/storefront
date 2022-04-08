import 'dotenv/config';
import { truncateTable, prepare, login } from './helpers/users';
import { UserStore } from '../models/user.model';
import app from '../server';
import request from 'supertest';

const store = new UserStore();

describe('User Model', () => {
  beforeAll(prepare);
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

  it('create method should add a user', async () => {
    const result = await store.create({
      first_name: 'Sayed',
      last_name: 'ayman',
      email: 'sayedayman203@gmail.com',
      password: 'Strong Password',
      role: 'user',
    });
    expect(result.id).toBe(3);
    expect(result.password).not.toBe('Strong Password');
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toBe(3);
    expect(result[0].first_name).toMatch('fadmin');
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(2);
    expect(result.id).toBe(2);
    expect(result.email).toMatch('user@gmail.com');
  });

  it('update method should update user', async () => {
    const product = await store.update(2, {
      first_name: 'Sayed',
    });

    expect(product.id).toEqual(2);
    expect(product.first_name).toEqual('Sayed');
  });
});

describe('User api', () => {
  const agent = request(app);
  beforeEach(prepare);
  afterAll(truncateTable);

  it('register user', async () => {
    // admin
    const res = await agent.post('/user').send({
      first_name: 'Sayed',
      last_name: 'ayman',
      email: 'sayedayman203@gmail.com',
      password: 'Strong Password',
    });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
  });

  it('login user', async () => {
    const adminRes = await agent.post('/user/login').send({
      email: 'user@gmail.com',
      password: '123',
    });
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(Object.keys(adminRes.body.data)).toContain('token');
    expect(Object.keys(adminRes.body.data.user)).toContain('id');
  });

  it("admin can list all users - user can't", async () => {
    // admin
    const { token: adminToken } = await login(agent, 'admin');

    const adminRes = await agent
      .get('/user/')
      .set({ Authorization: `Bearer ${adminToken}` });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.length).toBe(2);

    // user
    const { token: userToken } = await login(agent, 'user');

    const userRes = await agent
      .get('/user/')
      .set({ Authorization: `Bearer ${userToken}` });

    expect(userRes.status).toBe(401);
  });

  it("admin and user can update there profiles - user can't update his role", async () => {
    // admin
    const { token: adminToken } = await login(agent, 'admin');
    const adminRes = await agent
      .patch('/user/me')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        first_name: 'Sayed',
      });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(1);
    expect(adminRes.body.data.first_name).toBe('Sayed');

    // user
    const { token: userToken } = await login(agent, 'user');

    const userRes = await agent
      .patch('/user/me')
      .set({ Authorization: `Bearer ${userToken}` })
      .send({
        first_name: 'Sayed2',
        role: 'admin',
      });
    expect(userRes.status).toBe(200);
    expect(userRes.body.status).toBe('success');
    expect(userRes.body.data.id).toBe(2);
    expect(userRes.body.data.first_name).toBe('Sayed2');
    expect(userRes.body.data.role).toBe('user');
    expect(Object.keys(userRes.body.data)).not.toContain('password');
  });

  it("admin can update other users profile and role - user can't", async () => {
    // user
    const { token: userToken } = await login(agent, 'user');
    const userRes1 = await agent
      .patch('/user/1')
      .set({ Authorization: `Bearer ${userToken}` })
      .send({
        first_name: 'new name',
        role: 'user',
      });

    expect(userRes1.status).toBe(401);

    // admin
    const { token: adminToken } = await login(agent, 'admin');
    const adminRes = await agent
      .patch('/user/2')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        first_name: 'new name',
        role: 'admin',
      });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(2);
  });
});
