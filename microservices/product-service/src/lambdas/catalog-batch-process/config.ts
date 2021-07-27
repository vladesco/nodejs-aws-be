import { LambdaConfig } from '@nodejs/aws-be/types';

export const catalogBatchProcessLambdaConfig: LambdaConfig = {
    events: [
        {
            sqs: {
                arn: '${self:custom.dotenvVars.SQSARN}',
                batchSize: 5,
            },
        },
    ],
};
