CREATE TABLE IF NOT EXISTS order_product (
    order_id integer NOT NULL REFERENCES orders(id),
    product_id integer NOT NULL REFERENCES products(id),
    price numeric(10,2) NOT NULL CHECK(price >= 0),
    quantity integer NOT NULL CHECK(quantity > 0),
    UNIQUE (order_id, product_id)
);