import { initBasicAuthorizerLambda } from './lambda';
import { AuthentificationService, PolicyService } from './services';
import { AuthentificationServiceConfig } from './types';

export const createBasicAuthorizerLambda = (): ReturnType<
    typeof initBasicAuthorizerLambda
> => {
    const authentificationServiceConfig: AuthentificationServiceConfig = {
        users: process.env,
    };

    const authentificationService = new AuthentificationService(
        authentificationServiceConfig
    );
    const policyService = new PolicyService();

    return initBasicAuthorizerLambda(authentificationService, policyService);
};
