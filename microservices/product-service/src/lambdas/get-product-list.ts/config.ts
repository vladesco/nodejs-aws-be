import { LambdaConfig } from '@nodejs/aws-be/types';

export const productListServiceConfig: LambdaConfig = {
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
