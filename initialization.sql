-- create admin and users -- password 123456789
INSERT INTO users(first_name, last_name, email, password, role)
	VALUES ('fname', 'lname', 'admin@gmail.com', '$2b$10$COq.rKU6Ao3sX/gZhsAkXuGbNBMxJixG.0qbrj0x04k0CKFO06aZm', 'admin');

INSERT INTO users(first_name, last_name, email, password, role)
	VALUES ('Sayed', 'Ayman', 'user1@gmail.com', '$2b$10$COq.rKU6Ao3sX/gZhsAkXuGbNBMxJixG.0qbrj0x04k0CKFO06aZm', 'user');
           ('Sayed', 'Ayman', 'user2@gmail.com', '$2b$10$COq.rKU6Ao3sX/gZhsAkXuGbNBMxJixG.0qbrj0x04k0CKFO06aZm', 'user');

-- create products
INSERT INTO products(
	name, description, price)
	VALUES ('prod 1', 'data description',15.94),
	       ('prod 2', 'data description',12.9),
	       ('prod 3', 'data description',125.9),
           ('prod 4', 'data description',18.0),
           ('prod 5', 'data description',19.29),
           ('prod 6', 'data description',28.19);

-- create orders
WITH new_order AS (INSERT INTO orders(user_id) VALUES (2) RETURNING id)
      INSERT INTO order_product(order_id, product_id, price, quantity)
      VALUES ((select id from new_order), 1, (select price from products WHERE id = 1), 15),
      ((select id from new_order), 2, (select price from products WHERE id = 2), 3),
      ((select id from new_order), 3, (select price from products WHERE id = 3), 1);

WITH new_order AS (INSERT INTO orders(user_id) VALUES (3) RETURNING id)
      INSERT INTO order_product(order_id, product_id, price, quantity)
      VALUES ((select id from new_order), 1, (select price from products WHERE id = 1), 9),
      ((select id from new_order), 3, (select price from products WHERE id = 3), 5),
      ((select id from new_order), 6, (select price from products WHERE id = 6), 7);