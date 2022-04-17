import { updateQuery } from '@helpers/psql';
import Client from '@src/database';

export type Order = {
  id: number;
  user_id: string;
  status: 'active' | 'complete' | 'cancel';
};

export class OrderStore {
  async index(uid?: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders${uid ? ' WHERE user_id = ($1)' : ''};`;
      const result = await conn.query(sql, uid ? [uid] : undefined);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  async checkUser(oid: number, uid: number): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE id = ($1) AND user_id = ($2);`;
      const result = await conn.query(sql, [oid, uid]);
      conn.release();
      if (result.rows[0]) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    try {
      const conn = await Client.connect();
      const whitelist = ['status'];

      const [updates, data] = updateQuery(order, whitelist);
      if (updates.length > 0) {
        const sql = `UPDATE orders SET ${updates.join(
          ', '
        )} WHERE id = ${id} AND status = 'active'
        RETURNING *;`;
        const result = await conn.query(sql, data);
        conn.release();
        return result.rows[0];
      } else {
        throw new Error('NO_UPDATES');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'NO_UPDATES') {
        throw new Error('NO_UPDATES');
      } else {
        throw new Error(`Could not create order. Error: ${error}`);
      }
    }
  }
}
