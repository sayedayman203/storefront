import { updateQuery } from '@helpers/psql';
import Client from '@src/database';

export type Order = {
  id: number;
  user_id: string;
  status: 'active' | 'complete' | 'cancel';
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  async show(id: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get order. Error: ${error}`);
    }
  }

  async create(order: Order): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2);';
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create order. Error: ${error}`);
    }
  }

  async update(id: number, order: Partial<Order>): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const whitelist = ['status'];

      const [updates, data] = updateQuery(order, whitelist);
      if (updates.length > 0) {
        const sql = `UPDATE orders SET ${updates.join(', ')} WHERE id = ${id};`;
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
