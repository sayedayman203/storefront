import { updateQuery } from '@helpers/psql';
import Client from '@src/database';
import { hash, compare } from 'bcrypt';
export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

export type UserOPass = Omit<User, 'password'> & { password?: string };

export class UserStore {
  async index(): Promise<UserOPass[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get users. Error: ${error}`);
    }
  }

  async show(id: number): Promise<UserOPass> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get user. Error: ${error}`);
    }
  }

  async create(user: User): Promise<UserOPass> {
    try {
      const conn = await Client.connect();
      user.password = await hash(user.password, 10);
      const sql =
        'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.role,
      ]);
      conn.release();
      /**
       ** set default very first user to be admin
       *? this is only for testing and helping to create admin
       *! should remove this condtion if project changed to production mode
       */
      if (process.env.NODE_ENV !== 'test' && result.rows[0].id == 1) {
        this.update(result.rows[0].id, { role: 'admin' });
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create user. Error: ${error}`);
    }
  }

  async login(email: string, password: string): Promise<UserOPass | false> {
    try {
      const conn = await Client.connect();
      //   user.password = await hash(user.password, 10);
      const sql = 'SELECT * FROM users WHERE email = ($1);';
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rowCount > 0) {
        if (await compare(password, result.rows[0].password)) {
          return result.rows[0];
        }
      }
      return false;
    } catch (error) {
      throw new Error(`Could not verify user. Error: ${error}`);
    }
  }

  async update(id: number, user: Partial<User>): Promise<UserOPass> {
    try {
      const conn = await Client.connect();
      const whitelist = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
      ];

      const [updates, data] = updateQuery(user, whitelist);
      if (updates.length > 0) {
        const sql = `UPDATE users SET ${updates.join(
          ', '
        )} WHERE id = ${id} RETURNING *;`;
        const result = await conn.query(sql, data);
        conn.release();
        return result.rows[0];
      } else {
        throw new Error('NO_UPDATES');
      }
    } catch (error) {
      if ((error as Error).message === 'NO_UPDATES') {
        throw new Error('NO_UPDATES');
      } else {
        throw new Error(`Could not create user. Error: ${error}`);
      }
    }
  }
}
