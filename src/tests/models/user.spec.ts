import { UserOPass } from '@models/user.model';
import 'dotenv/config';
import { truncateTableUsers } from './../helpers/users';
import { UserStore, User } from '../../models/user.model';

const store = new UserStore();

const adminData: User = {
  first_name: 'fadmin',
  last_name: 'ladmin',
  email: 'admin@gmail.com',
  password: '123',
  role: 'admin',
};

const userData: User = {
  first_name: 'Sayed',
  last_name: 'ayman',
  email: 'sayedayman203@gmail.com',
  password: 'Strong Password',
  role: 'user',
};
const accounts = [adminData, userData];

describe('User Model', () => {
  afterAll(truncateTableUsers);

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

  it('should have a login method', () => {
    expect(store.login).toBeDefined();
  });

  it('create method should add a user', async () => {
    // admin
    const admin = await store.create({ ...adminData });
    expect(admin.id).toBeDefined();
    expect(admin.password).not.toBe(adminData.password);
    expect(admin.email).toBe(adminData.email);
    adminData.id = admin.id;

    // user
    const user = await store.create({ ...userData });
    expect(user.id).toBeDefined();
    expect(user.password).not.toBe(userData.password);
    expect(user.email).toBe(userData.email);
    userData.id = user.id;
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toBe(accounts.length);
    expect(result[0].first_name).toBe(accounts[0].first_name);
  });

  it('show method should return the correct user', async () => {
    const acc = accounts[accounts.length - 1];
    const result = await store.show(acc.id as unknown as number);
    expect(result.id).toBe(acc.id);
    expect(result.email).toBe(acc.email);
  });

  it('update method should update user', async () => {
    const acc = accounts[accounts.length - 1];

    const result = await store.update(acc.id as unknown as number, {
      first_name: 'new name',
    });

    expect(result.id).toEqual(acc.id);
    expect(result.first_name).toEqual('new name');
    acc.first_name = 'new name';
  });

  it('login method should return user if credintials valid', async () => {
    const acc = accounts[accounts.length - 1];

    const result = await store.login(acc.email, acc.password);

    expect((result as unknown as UserOPass).id).toEqual(acc.id);
    expect((result as unknown as UserOPass).email).toEqual(acc.email);
  });
});
