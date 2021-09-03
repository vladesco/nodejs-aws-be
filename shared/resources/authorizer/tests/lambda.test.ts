import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { initBasicAuthorizerLambda } from '../lambda';
import { AuthentificationService, PolicyService } from '../services';

jest.mock('../services');

describe('basic authorizer lambda', () => {
    let mockAuthentificationService: jest.Mocked<AuthentificationService>;
    let mockPolicyService: jest.Mocked<PolicyService>;
    let basicAuthorizerLambda: Function;

    beforeEach(() => {
        (AuthentificationService as any).mockClear();
        (PolicyService as any).mockClear();

        basicAuthorizerLambda = initBasicAuthorizerLambda(
            new AuthentificationService(null),
            new PolicyService()
        );

        [mockAuthentificationService] = (AuthentificationService as any).mock.instances;
        [mockPolicyService] = (PolicyService as any).mock.instances;
    });

    it('should return generated policy', async () => {
        const authorizationToken = `Basic ${Buffer.from('user:password').toString(
            'base64'
        )}`;

        const expectedPolicy: APIGatewayAuthorizerResult = {
            principalId: 'test resource arn',
            policyDocument: null,
        };

        const authorizationEvent: Partial<APIGatewayTokenAuthorizerEvent> = {
            authorizationToken,
        };

        mockPolicyService.generatePolicy.mockReturnValue(expectedPolicy);

        const generatedPolicy = await basicAuthorizerLambda(authorizationEvent);

        expect(generatedPolicy).toBe(expectedPolicy);
    });

    it('should call authentificationService authentificate method with correct params', async () => {
        const user = 'test user';
        const password = 'test password';
        const userCredentials = Buffer.from(`${user}:${password}`).toString('base64');

        const authorizationEvent: Partial<APIGatewayTokenAuthorizerEvent> = {
            authorizationToken: `Basic ${userCredentials}`,
        };

        await basicAuthorizerLambda(authorizationEvent);

        expect(mockAuthentificationService.authentificate).toHaveBeenCalledWith(
            user,
            password
        );
    });

    it('should call policyService generatePolicy method with correct params', async () => {
        const user = 'test user';
        const password = 'test password';
        const methodArn = 'test method arn';
        const isUserAuthentificated = false;
        const userCredentials = Buffer.from(`${user}:${password}`).toString('base64');

        const authorizationEvent: Partial<APIGatewayTokenAuthorizerEvent> = {
            authorizationToken: `Basic ${userCredentials}`,
            methodArn,
        };

        mockAuthentificationService.authentificate.mockReturnValue(isUserAuthentificated);

        await basicAuthorizerLambda(authorizationEvent);

        expect(mockPolicyService.generatePolicy).toHaveBeenCalledWith(
            userCredentials,
            methodArn,
            isUserAuthentificated
        );
    });

    it('should throw Unauthorized error if token was not provided', async () => {
        const authorizationEvent: Partial<APIGatewayTokenAuthorizerEvent> = {
            authorizationToken: `Basic  ${Buffer.from('user').toString('base64')}`,
        };

        try {
            await basicAuthorizerLambda(authorizationEvent);
        } catch (error) {
            expect(error).toBe('Unauthorized');
        }
    });

    it('should throw Unauthorized error if any error occur', async () => {
        const authorizationEvent: Partial<APIGatewayTokenAuthorizerEvent> = {
            authorizationToken: null,
        };

        mockPolicyService.generatePolicy.mockImplementation(() => {
            throw new Error();
        });

        try {
            await basicAuthorizerLambda(authorizationEvent);
        } catch (error) {
            expect(error).toBe('Unauthorized');
        }
    });
});
