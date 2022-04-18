# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

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

## API Endpoints

#### Users

| Method | Key         | body Schema                                                             | Auth Type   | Note    |
| ------ | ----------- | ----------------------------------------------------------------------- | ----------- | ------- |
| POST   | /user/      | {first_name, last_name, email, password}                                | -           |         |
| POST   | /user/login | {email, password}                                                       | -           |         |
| GET    | /user/      | -                                                                       | admin       |         |
| GET    | /user/me    | -                                                                       | user, admin |         |
| patch  | /user/me    | {first_name, last_name, email, password}                                | user, admin | Partial |
| GET    | /user/:id   | -                                                                       | admin       |         |
| patch  | /user/:id   | Partial {first_name, last_name, email, password, role: (admin or user)} | admin       | Partial |

#### Products

| Method | Key          | body Schema                | Auth Type   | Note    |
| ------ | ------------ | -------------------------- | ----------- | ------- |
| POST   | /product/    | {name, description, price} | admin       |         |
| GET    | /product/    | -                          | -           |         |
| GET    | /product/:id | -                          | -           |         |
| patch  | /product/:id | {name, description, price} | user, admin | Partial |
| DELETE | /product/:id | -                          | admin       |         |

#### Orders

| Method | Key                | body Schema                    | Auth Type   | Note                             |
| ------ | ------------------ | ------------------------------ | ----------- | -------------------------------- |
| GET    | /order/            | -                              | user, admin | user => his orders, admin => all |
| POST   | /order/            | { product: {id, quantity}[] }  | user        |                                  |
| GET    | /order/:id         | -                              | user, admin | user => his orders, admin => all |
| patch  | /order/:id         | { product: {id, quantity}[] }  | user, admin | old => update, new => create     |
| DELETE | /order/:id/:prodId | -                              | user        |                                  |
| post   | /order/:id/status  | {status: (complete or cancel)} | admin       |                                  |

## Data Shapes

#### Product

- id
- name
- description
- price

#### User

- id
- first_name
- last_name
- email
- password
- role (admin or user)

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete or cancel)
- products:
  - id
  - name
  - quantity
  - price

## Database Diagram

![Image Caption](diagram.svg)
