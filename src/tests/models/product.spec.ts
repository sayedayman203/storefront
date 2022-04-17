import { Product } from './../../models/product.model';
import 'dotenv/config';
import { truncateTableProducts } from '../helpers/products';
import { ProductStore } from '../../models/product.model';

const store = new ProductStore();

const products: Product[] = [
  {
    name: 'myProduct',
    description: 'my own product',
    price: 70.89,
  },
];
describe('Product Model', () => {
  beforeAll(async () => {
    await truncateTableProducts();
  });
  afterAll(async () => {
    await truncateTableProducts();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({ ...products[0] });
    expect(result[0].id).toBeDefined();
    products[0].id = result[0].id;
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result.length).toBe(products.length);
    expect(result[0].name).toBe(products[0].name);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(products[0].id as unknown as number);
    expect(result.id).toBe(products[0].id);
    expect(result.name).toBe(products[0].name);
  });

  it('update method should update product', async () => {
    const product = await store.update(products[0].id as unknown as number, {
      name: 'New name for prooduct',
    });

    expect(product.id).toEqual(products[0].id);
    expect(product.name).not.toBe(products[0].name);
    expect(product.name).toBe('New name for prooduct');
  });
});
