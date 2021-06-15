import { createProductLambda } from './lambdas/get-product-by-id';
import { createProductlistLambda } from './lambdas/get-product-list.ts';
import { ProductService } from './services';
import { ProductRepository } from './repositories';

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

productRepository.connect();

export const productLambda = createProductLambda(productService);
export const productListLambda = createProductlistLambda(productService);
