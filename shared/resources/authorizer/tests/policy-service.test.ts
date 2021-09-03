import { PolicyService } from '../services';

describe('policy service', () => {
    describe('generatePolicy method', () => {
        const policyService = new PolicyService();

        it('should return policy with passed params and with setted permissions', async () => {
            const userToken = 'test user token';
            const resourceArn = 'test resource arn';
            let isAllowed = false;

            let expectedPolicy = {
                principalId: userToken,
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: 'Deny',
                            Resource: resourceArn,
                        },
                    ],
                },
            };

            let generatedPolicy = policyService.generatePolicy(
                userToken,
                resourceArn,
                isAllowed
            );

            expect(generatedPolicy).toEqual(expectedPolicy);

            isAllowed = true;

            expectedPolicy = {
                principalId: userToken,
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: 'Allow',
                            Resource: resourceArn,
                        },
                    ],
                },
            };

            generatedPolicy = policyService.generatePolicy(
                userToken,
                resourceArn,
                isAllowed
            );

            expect(generatedPolicy).toEqual(expectedPolicy);
        });
    });
});
