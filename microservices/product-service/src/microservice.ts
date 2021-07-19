import { Pool } from 'pg';
import { SNS } from 'aws-sdk';
import { initGetProductLambda } from './lambdas/get-product-by-id';
import { initGetProductlistLambda } from './lambdas/get-product-list';
import { NotificationService, ProductService } from './services';
import { ProductRepository } from './repositories';
import { initCreateProductLambda } from './lambdas/create-product';
import { initCatalogBatchProcessLambda } from './lambdas/catalog-batch-process';
import { NotificationServiceConfig } from './types';

const notificationServiceConfig: NotificationServiceConfig = {
    snsArn: process.env.SNS_ARN,
};

const notificationQueue = new SNS({ region: 'eu-west-1' });
const pgPool = new Pool({
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: Number(process.env.PG_PORT),
    max: 10,
    min: 0,
});

const productRepository = new ProductRepository(pgPool);
const productService = new ProductService(productRepository);
const notificationService = new NotificationService(
    notificationQueue,
    notificationServiceConfig
);

export const getPoductLambda = initGetProductLambda(productService);
export const getProductListLambda = initGetProductlistLambda(productService);
export const createProductLambda = initCreateProductLambda(productService);
export const catalogBatchProcessLambda = initCatalogBatchProcessLambda(
    productService,
    notificationService
);
