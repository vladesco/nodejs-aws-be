import { LambdaConfig } from '@nodejs/aws-be/types';

export const productServiceConfig: LambdaConfig = {
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
