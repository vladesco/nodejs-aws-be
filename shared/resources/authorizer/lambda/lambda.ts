import 'source-map-support/register';
import { LambdaAuthorizer } from '../../../types';
import { UnauthorizedError } from '../../../classes';
import { AuthentificationService, PolicyService } from '../services';

export const initBasicAuthorizerLambda: (
    authentificationService: AuthentificationService,
    policyService: PolicyService
) => LambdaAuthorizer<'TOKEN'> = (authentificationService, policyService) =>
    async function basicAuthorizerLambda(event) {
        try {
            const [_, token] = event.authorizationToken.split(' ');

            if (!token) {
                throw new UnauthorizedError('shoud provide token');
            }

            const [userName, password] = Buffer.from(token, 'base64')
                .toString()
                .split(':');
            const isAuthorized = authentificationService.authentificate(
                userName,
                password
            );

            return policyService.generatePolicy(token, event.methodArn, isAuthorized);
        } catch (error) {
            throw 'Unauthorized';
        }
    };
