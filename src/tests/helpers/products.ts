import 'dotenv/config';
import { Product, ProductStore } from '../../models/product.model';
import Client from '../../database';

export const truncateTable = async (): Promise<void> => {
  const conn = await Client.connect();
  const sql = 'TRUNCATE products RESTART IDENTITY CASCADE;';
  await conn.query(sql);
  conn.release();
};

export const createProducts = async (n = 1): Promise<Product[]> => {
  const store = new ProductStore();
  const products = await store.create(
    [...Array(n).keys()].map((index) => {
      const price = parseFloat((Math.random() * 1_000_000 + 1).toFixed(2));
      return {
        name: `product ${index + 1}`,
        description: `very ${price > 500_000 ? 'expensive' : 'cheap'} product`,
        price,
      };
    })
  );
  return products;
};

export const prepare = async (): Promise<void> => {
  await truncateTable();
  await createProducts(5);
};
