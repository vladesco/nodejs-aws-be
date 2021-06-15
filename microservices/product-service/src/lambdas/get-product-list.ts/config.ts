import { LambdaConfig } from '@nodejs/aws-be/types';

export const getProductListLambdaConfig: LambdaConfig = {
    events: [
        {
            http: {
                method: 'get',
                path: 'products',
                cors: true,
            },
        },
    ],
};
