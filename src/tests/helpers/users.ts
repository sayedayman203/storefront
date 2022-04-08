import 'dotenv/config';
import { UserStore, UserOPass } from '../../models/user.model';
import Client from '../../database';
import { SuperTest, Test } from 'supertest';

export const truncateTable = async (): Promise<void> => {
  const conn = await Client.connect();
  const sql = 'TRUNCATE users RESTART IDENTITY CASCADE;';
  await conn.query(sql);
  conn.release();
};

export const createAdmin = async (): Promise<UserOPass> => {
  const store = new UserStore();
  const user = await store.create({
    first_name: 'fadmin',
    last_name: 'ladmin',
    email: 'admin@gmail.com',
    password: '123',
    role: 'admin',
  });
  return user;
};

export const createUser = async (): Promise<UserOPass> => {
  const store = new UserStore();
  const user = await store.create({
    first_name: 'fuser',
    last_name: 'luser',
    email: 'user@gmail.com',
    password: '123',
    role: 'user',
  });
  return user;
};

export const prepare = async (): Promise<void> => {
  await truncateTable();
  await createAdmin();
  await createUser();
};

export const login = async (
  agent: SuperTest<Test>,
  type: 'user' | 'admin'
): Promise<{ token: string; user: UserOPass }> => {
  const res = await agent.post('/user/login').send({
    email: `${type}@gmail.com`,
    password: '123',
  });
  return res.body.data;
};
