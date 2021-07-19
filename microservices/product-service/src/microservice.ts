import { Client } from 'pg';
import { initGetProductLambda } from './lambdas/get-product-by-id';
import { initGetProductlistLambda } from './lambdas/get-product-list';
import { ProductService } from './services';
import { ProductRepository } from './repositories';
import { initCreateProductLambda } from './lambdas/create-product';

const pgClient = new Client({
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: Number(process.env.PG_PORT),
});

const productRepository = new ProductRepository(pgClient);
const productService = new ProductService(productRepository);

export const getPoductLambda = initGetProductLambda(productService);
export const getProductListLambda = initGetProductlistLambda(productService);
export const createProductLambda = initCreateProductLambda(productService);
