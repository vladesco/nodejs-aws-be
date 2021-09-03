import { APIGatewayAuthorizerResult } from 'aws-lambda';

export class PolicyService {
    public generatePolicy(
        userToken: string,
        resourceArn: string,
        isAllowed: boolean
    ): APIGatewayAuthorizerResult {
        return {
            principalId: userToken,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: isAllowed ? 'Allow' : 'Deny',
                        Resource: resourceArn,
                    },
                ],
            },
        };
    }
}
