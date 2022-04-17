import { expand } from '@helpers/psql';
import Client from '@src/database';

export type DefaultOrderProduct = {
  order_id: number;
  product_id: number;
  price: number;
  quantity: number;
};

export type OrderProduct = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

export type FullOrder = {
  id: number;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  products: OrderProduct[];
};

export class OrderProductsService {
  async show(oid: number, uid?: number): Promise<FullOrder> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT
        o.id as id,
        ${
          !uid
            ? `json_build_object(
            'id', u.id,
            'full_name', u.first_name || ' ' || u.last_name,
            'email', u.email
        ) as user,`
            : ''
        }
        json_agg(json_build_object(
            'product_id', op.product_id,
            'name', p.name,
            'quantity', op.quantity,
            'price', op.price
        )) as products
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id ${uid ? ' AND u.id = ($1)' : ''}
      INNER JOIN order_product op ON o.id = op.order_id
      INNER JOIN products p ON p.id = op.product_id
      WHERE o.id = (${uid ? '($2)' : '($1)'})
      GROUP BY o.id, u.id;`;
      const result = await conn.query(
        sql,
        [uid ? uid : null, oid].filter((x) => x)
      );
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get order. Error: ${error}`);
    }
  }

  async create(
    user_id: number,
    products: { id: number; quantity: number }[]
  ): Promise<FullOrder> {
    try {
      const conn = await Client.connect();
      const sql = `WITH new_order AS (INSERT INTO orders(user_id) VALUES ($1) RETURNING id)
      INSERT INTO order_product(order_id, product_id, price, quantity)
      VALUES ${expand(
        products.length,
        2,
        (id1, id2) =>
          `((select id from new_order), ($${id1}), (select price from products WHERE id = ($${id1})), ($${id2}))
          `,
        2
      )}
      RETURNING *;`;
      const result = await conn.query(sql, [
        user_id,
        ...products.map((prod) => [prod.id, prod.quantity]).flat(),
      ]);
      conn.release();
      if (result.rows.length > 0) {
        return this.show(result.rows[0].order_id);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      throw new Error(`Could not create order. Error: ${error}`);
    }
  }
}
