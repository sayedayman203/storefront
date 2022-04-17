import 'dotenv/config';
import { UserStore, UserOPass, User } from '../../models/user.model';
import Client from '../../database';
import { SuperTest, Test } from 'supertest';

export const truncateTableUsers = async (): Promise<void> => {
  const conn = await Client.connect();
  const sql = 'TRUNCATE users RESTART IDENTITY CASCADE;';
  await conn.query(sql);
  conn.release();
};

const store = new UserStore();

export const createUser = async (user: User): Promise<UserOPass> => {
  const res = await store.create({ ...user });
  return res;
};

export const prepareUsers = async (): Promise<User[]> => {
  const accounts: User[] = [
    {
      first_name: 'fadmin',
      last_name: 'ladmin',
      email: 'admin@gmail.com',
      password: '12345678',
      role: 'admin',
    },
    {
      first_name: 'fuser',
      last_name: 'luser',
      email: `user1@gmail.com`,
      password: '12345678',
      role: 'user',
    },
    {
      first_name: 'fuser',
      last_name: 'luser',
      email: `user2@gmail.com`,
      password: '12345678',
      role: 'user',
    },
  ];
  await truncateTableUsers();
  const users = await Promise.all(accounts.map((user) => createUser(user)));
  users.map((u, index) => {
    accounts[index].id = u.id;
  });
  return accounts;
};

export const getTokens = async (
  agent: SuperTest<Test>,
  data: { email: string; password: string }[]
): Promise<string[]> => {
  const resps = await Promise.all(
    data.map((cred) => agent.post('/user/login').send(cred))
  );

  return resps.map((x) => x.body.data.token);
};
