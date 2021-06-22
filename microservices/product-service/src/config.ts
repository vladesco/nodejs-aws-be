import { MicroserviceConfig } from '@nodejs/aws-be/types';
import { addPathToLambdaConfig } from '@nodejs/aws-be/utils';
import { productServiceConfig } from './lambdas/get-product-by-id';
import { productListServiceConfig } from './lambdas/get-product-list.ts';

export const microseviceConfig: MicroserviceConfig = {
    productLambda: addPathToLambdaConfig(
        productServiceConfig,
        `${__dirname}/microservice.productLambda`
    ),
    productListLambda: addPathToLambdaConfig(
        productListServiceConfig,
        `${__dirname}/microservice.productListLambda`
    ),
};
