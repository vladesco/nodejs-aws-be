import { LambdaConfig } from '@nodejs/aws-be/types';

export const createProductLambdaConfig: LambdaConfig = {
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
                cors: true,
            },
        },
    ],
};
