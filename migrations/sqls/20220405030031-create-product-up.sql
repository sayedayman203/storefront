CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL check(price >= 0),
    deleted_at date DEFAULT NULL
);