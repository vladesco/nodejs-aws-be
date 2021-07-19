import { LambdaConfig } from '@nodejs/aws-be/types';

export const uploadFileLambdaConfig: LambdaConfig = {
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                cors: true,
                request: {
                    parameters: {
                        querystrings: {
                            filename: true,
                        },
                    },
                },
            },
        },
    ],
};
