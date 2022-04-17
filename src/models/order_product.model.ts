import { expand } from '@helpers/psql';
import Client from '@src/database';

export type OrderProduct = {
  order_id: number;
  product_id: number;
  price: number;
  quantity: number;
};

export class OrderProductsStore {
  async update(
    oid: number,
    products: {
      id: number;
      quantity: number;
    }[]
  ): Promise<OrderProduct[]> {
    try {
      const conn = await Client.connect();
      const sql = `
      INSERT INTO order_product(order_id, product_id, price, quantity)
      VALUES ${expand(
        products.length,
        2,
        (id1, id2) =>
          `(($1), ($${id1}), (select price from products WHERE id = ($${id1})), ($${id2}))
          `,
        2
      )}
      ON CONFLICT (order_id, product_id)
      DO UPDATE
      SET quantity = EXCLUDED.quantity
      RETURNING *;`;
      const result = await conn.query(sql, [
        oid,
        ...products.map((prod) => [prod.id, prod.quantity]).flat(),
      ]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not update order products. Error: ${error}`);
    }
  }

  async delete(oid: number, pid: number): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql = `DELETE FROM order_product
      WHERE order_id = ($1) AND product_id = ($2)
      RETURNING *;`;
      const result = await conn.query(sql, [oid, pid]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update order product. Error: ${error}`);
    }
  }
}
