import { Pool } from 'pg';

const {
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;
const Client = new Pool({
  host: POSTGRES_HOST,
  database: NODE_ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  ...(POSTGRES_PORT ? { port: parseInt(POSTGRES_PORT) } : {}),
});

export default Client;
