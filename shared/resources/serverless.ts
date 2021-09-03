import { AWS } from '@serverless/typescript';
import { addPathToLambdaConfig } from '../utils';
import { basicAuthorizerLambdaConfig } from './authorizer';

const resourcesConfiguration: AWS = {
    service: 'resources',
    frameworkVersion: '2',
    provider: { name: 'aws', region: 'eu-west-1' },
    plugins: [
        'serverless-webpack',
        'serverless-export-outputs',
        'serverless-plugin-split-stacks',
    ],
    custom: {
        dotenvVars: '${file(./index.js)}',
        exportOutputs: {
            include: [
                'SQSARN',
                'SQSURL',
                'DeadLetterSQSARN',
                'DeadLetterSQSURL',
                'SNSTopicARN',
                'AuthorizerURL',
            ],
            output: {
                file: './.env',
                format: 'toml',
            },
        },
        splitStacks: {
            perFunction: true,
            perType: false,
            perGroupFunction: false,
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
            AuthorizerURL: {
                Description: 'URL of new Authorizer',
                Value: { 'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'] },
            },
        },
    },
    functions: {
        BasicAuthorizer: addPathToLambdaConfig(
            basicAuthorizerLambdaConfig,
            `${__dirname}/resources.basicAuthorizerLambda`
        ),
    },
};

module.exports = resourcesConfiguration;
