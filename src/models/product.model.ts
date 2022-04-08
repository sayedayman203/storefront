import { expand, updateQuery } from '@helpers/psql';
import Client from '@src/database';

export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE deleted_at IS NULL;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  }

  async show(id: number, deleted = false): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM products WHERE id = ($1)${
        deleted ? ' AND deleted_at IS NOT NULL' : ''
      };`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get product. Error: ${error}`);
    }
  }

  async create(product: Product | Product[]): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const values: (string | number)[] = [];
      if (Array.isArray(product)) {
        product.map((prod) => {
          values.push(prod.name, prod.description, prod.price);
        });
      } else {
        values.push(product.name, product.description, product.price);
      }
      const sql = `INSERT INTO products (name, description, price) VALUES ${expand(
        values.length / 3,
        3
      )} RETURNING *;`;
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not create product. Error: ${error}`);
    }
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    try {
      const conn = await Client.connect();
      const whitelist = ['name', 'description', 'price', 'deleted_at'];

      const [updates, data] = updateQuery(product, whitelist);
      if (updates.length > 0) {
        const sql = `UPDATE products SET ${updates.join(
          ', '
        )} WHERE id = ${id} RETURNING *;`;
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
        throw new Error(`Could not create product. Error: ${error}`);
      }
    }
  }

  //   async delete(id: string): Promise<Product> {
  //     try {
  //       const conn = await Client.connect();
  //       const sql = 'DELETE FROM products WHERE id = ($1);';
  //       const result = await conn.query(sql, [id]);
  //       conn.release();
  //       return result.rows[0];
  //     } catch (error) {
  //       throw new Error(`Could not delete products. Error: ${error}`);
  //     }
  //   }
}
