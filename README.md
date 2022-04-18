# storefront

## initialization

- copy `env.template` to `.env`.
- create database after connect to psql `CREATE DATABASE storefront;` if not exists.
- create test database `CREATE DATABASE storefront_test;` if not exists.
- edit env db credientials to your own `POSTGRES_HOST, POSTGRES_DB, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD`.
- run `db-migrate up`.
- run `initialization.sql` file with `psql -U postgres -d storefront -a -f initialization.sql `.
  or just create admin with first query.
- make sure JWT_SECRET equal to `d2&U21@4Eg$H=kHsK` to use my password `123456789`.
- run tests with `npm run test` or start wuth `npm run start`.
