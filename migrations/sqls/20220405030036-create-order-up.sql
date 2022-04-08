CREATE TYPE order_status AS ENUM ('active', 'complete', 'cancel');

CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id integer NOT NULL REFERENCES users(id), status order_status NOT NULL);