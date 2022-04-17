import 'dotenv/config';
import {
  OrderProductsService,
  FullOrder,
} from '../../services/order_product.service';
import Client from '../../database';

export const truncateTablesOrders = async (): Promise<void> => {
  const conn = await Client.connect();
  const sql = 'TRUNCATE orders RESTART IDENTITY CASCADE;';
  await conn.query(sql);
  const sql2 = 'TRUNCATE order_product RESTART IDENTITY CASCADE;';
  await conn.query(sql2);
  conn.release();
};

export const createOrder = async (uid: number, n = 1): Promise<FullOrder> => {
  const store = new OrderProductsService();
  return await store.create(
    uid,
    [...Array(n).keys()].map((index) => {
      const quantity = Math.floor(Math.random() * 20) + 1;
      return {
        id: index + 1,
        quantity,
      };
    })
  );
};
