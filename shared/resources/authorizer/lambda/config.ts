import { LambdaConfig } from '../../../types';

export const basicAuthorizerLambdaConfig: LambdaConfig = {
    environment: '${file(./authorizer/getAuthorizedUsers.js)}' as any,
};
