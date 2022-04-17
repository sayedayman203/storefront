import 'dotenv/config';
import { truncateTableUsers } from '../helpers/users';
import { UserStore, User } from '../../models/user.model';
import app from '../../server';
import request from 'supertest';

const store = new UserStore();

const accounts: User[] = [
  {
    first_name: 'fadmin',
    last_name: 'ladmin',
    email: 'admin@gmail.com',
    password: '123456789',
    role: 'admin',
  },
  {
    first_name: 'Sayed',
    last_name: 'ayman',
    email: 'sayedayman203@gmail.com',
    password: 'Strong Password',
    role: 'user',
  },
  {
    first_name: 'fname',
    last_name: 'lname',
    email: 'new@gmail.com',
    password: '12345678',
    role: 'user',
  },
];

describe('User api', () => {
  const agent = request(app);

  //   data
  const tokens = {
    user: '',
    admin: '',
  };

  const indexes = {
    user: -1,
    admin: -1,
  };

  beforeAll(async () => {
    const acc0 = await store.create({ ...accounts[0] });
    accounts[0].id = acc0.id;

    const acc1 = await store.create({ ...accounts[1] });
    accounts[1].id = acc1.id;
  });
  afterAll(truncateTableUsers);

  it('register user', async () => {
    const acc = accounts[2];
    // admin
    const res = await agent.post('/user').send({
      first_name: acc.first_name,
      last_name: acc.last_name,
      email: acc.email,
      password: acc.password,
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.id).toBeDefined();
    acc.id = res.body.data.user.id;
    tokens.user = res.body.data.token;
    indexes.user = 2;
  });

  it('login user', async () => {
    const acc = accounts[0];

    const res = await agent.post('/user/login').send({
      email: acc.email,
      password: acc.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.id).toBe(acc.id);
    tokens.admin = res.body.data.token;
    indexes.admin = 0;
  });

  it('admin can list all users', async () => {
    // admin
    const adminRes = await agent
      .get('/user/')
      .set({ Authorization: `Bearer ${tokens.admin}` });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.length).toBe(accounts.length);
  });

  it("user cann't list users", async () => {
    const userRes = await agent
      .get('/user/')
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(userRes.status).toBe(401);
  });

  it("admin and user can update there profiles - user can't update his role", async () => {
    // admin
    const adminRes = await agent
      .patch('/user/me')
      .set({ Authorization: `Bearer ${tokens.admin}` })
      .send({
        first_name: 'Sayed00',
      });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(accounts[indexes.admin].id);
    expect(adminRes.body.data.first_name).toBe('Sayed00');
    accounts[0].first_name = 'Sayed00';

    // user
    const userRes = await agent
      .patch('/user/me')
      .set({ Authorization: `Bearer ${tokens.user}` })
      .send({
        first_name: 'Sayed300',
        role: 'admin',
      });
    expect(userRes.status).toBe(200);
    expect(userRes.body.status).toBe('success');
    expect(userRes.body.data.id).toBe(accounts[indexes.user].id);
    expect(userRes.body.data.first_name).toBe('Sayed300');
    expect(userRes.body.data.role).toBe('user');
    expect(userRes.body.data.password).not.toBeDefined();
  });

  it('admin and user can see there profiles', async () => {
    // admin
    const adminRes = await agent
      .get('/user/me')
      .set({ Authorization: `Bearer ${tokens.admin}` });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(accounts[indexes.admin].id);

    // user
    const userRes = await agent
      .get('/user/me')
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(userRes.status).toBe(200);
    expect(userRes.body.status).toBe('success');
    expect(userRes.body.data.id).toBe(accounts[indexes.user].id);
  });

  it('admin can update other users profile and role', async () => {
    const acc = accounts[1];
    const adminRes = await agent
      .patch(`/user/${acc.id}`)
      .set({ Authorization: `Bearer ${tokens.admin}` })
      .send({
        first_name: 'new name',
        role: 'admin',
      });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(acc.id);
    expect(adminRes.body.data.first_name).toBe('new name');
    expect(adminRes.body.data.role).toBe('admin');
  });

  it("user can't update other users", async () => {
    const res = await agent
      .patch(`/user/${accounts[1].id}`)
      .set({ Authorization: `Bearer ${tokens.user}` })
      .send({
        first_name: 'new name',
        role: 'user',
      });

    expect(res.status).toBe(401);
  });

  it('admin can see other users profiles', async () => {
    const acc = accounts[1];
    const adminRes = await agent
      .get(`/user/${acc.id}`)
      .set({ Authorization: `Bearer ${tokens.admin}` });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('success');
    expect(adminRes.body.data.id).toBe(acc.id);
  });

  it("user can't see other users profiles", async () => {
    const res = await agent
      .get(`/user/${accounts[1].id}`)
      .set({ Authorization: `Bearer ${tokens.user}` });

    expect(res.status).toBe(401);
  });
});
