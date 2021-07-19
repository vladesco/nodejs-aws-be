import { MicroserviceConfig } from '@nodejs/aws-be/types';
import { addPathToLambdaConfig } from '@nodejs/aws-be/utils';
import { createProductLambdaConfig } from './lambdas/create-product';
import { getProductLambdaConfig } from './lambdas/get-product-by-id';
import { getProductListLambdaConfig } from './lambdas/get-product-list';

export const microseviceConfig: MicroserviceConfig = {
    getProductLambda: addPathToLambdaConfig(
        getProductLambdaConfig,
        `${__dirname}/microservice.getPoductLambda`
    ),
    getProductListLambda: addPathToLambdaConfig(
        getProductListLambdaConfig,
        `${__dirname}/microservice.getProductListLambda`
    ),
    createProductLambda: addPathToLambdaConfig(
        createProductLambdaConfig,
        `${__dirname}/microservice.createProductLambda`
    ),
};
