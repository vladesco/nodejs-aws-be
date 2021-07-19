import { AWS } from '@serverless/typescript';

const resourcesConfiguration: AWS = {
    service: 'item-notifications',
    frameworkVersion: '2',
    provider: { name: 'aws', region: 'eu-west-1' },
    plugins: ['serverless-export-outputs'],
    custom: {
        dotenvVars: '${file(./process-env.config.js)}',
        exportOutputs: {
            include: [
                'SQSARN',
                'SQSURL',
                'DeadLetterSQSARN',
                'DeadLetterSQSURL',
                'SNSTopicARN',
            ],
            output: {
                file: './.env',
                format: 'toml',
            },
        },
    },
    resources: {
        Resources: {
            catalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'CatalogItemsQueue',
                    VisibilityTimeout: 30,
                    RedrivePolicy: {
                        deadLetterTargetArn: {
                            'Fn::GetAtt': ['failedItemsQueue', 'Arn'],
                        },
                        maxReceiveCount: 5,
                    },
                },
            },
            failedItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'FailedItemsQueue',
                    VisibilityTimeout: 30,
                },
            },
            productTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'ProductTopic',
                },
            },
            hotProductsNotification: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '${self:custom.dotenvVars.HOT_NOTIFICATIONS_EMAIL}',
                    Protocol: 'email',
                    TopicArn: { Ref: 'productTopic' },
                    FilterPolicy: {
                        count: [{ numeric: ['<=', 10] }],
                    },
                },
            },
            productsNotification: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '${self:custom.dotenvVars.NOTIFICATIONS_EMAIL}',
                    Protocol: 'email',
                    TopicArn: { Ref: 'productTopic' },
                    FilterPolicy: {
                        count: [{ numeric: ['>', 10] }],
                    },
                },
            },
        },
        Outputs: {
            SQSARN: {
                Description: 'ARN of new Items SQS Queue',
                Value: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
            },
            SQSURL: {
                Description: 'URL of new Items SQS Queue',
                Value: { Ref: 'catalogItemsQueue' },
            },
            DeadLetterSQSARN: {
                Description: 'ARN of new failed Items SQS Queue',
                Value: { 'Fn::GetAtt': ['failedItemsQueue', 'Arn'] },
            },
            DeadLetterSQSURL: {
                Description: 'URL of new failed Items SQS Queue',
                Value: { Ref: 'failedItemsQueue' },
            },
            SNSTopicARN: {
                Description: 'ARN of new SNS Products Topic',
                Value: { Ref: 'productTopic' },
            },
        },
    },
};

module.exports = resourcesConfiguration;