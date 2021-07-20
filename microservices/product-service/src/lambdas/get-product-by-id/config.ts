import { LambdaConfig } from '@nodejs/aws-be/types';

export const getProductLambdaConfig: LambdaConfig = {
    events: [
        {
            http: {
                method: 'get',
                path: 'products/{id}',
                cors: true,
            },
        },
    ],
};
