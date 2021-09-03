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
                authorizer: {
                    arn: '${self:custom.dotenvVars.AuthorizerURL}',
                    resultTtlInSeconds: 0,
                    identitySource: 'method.request.header.authorization',
                    type: 'token',
                },
            },
        },
    ],
};
