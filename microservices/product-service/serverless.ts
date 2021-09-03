import { AWS } from '@serverless/typescript';
import { microserviceConfig } from './src/config';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
        },
        dotenvVars: '${file(./process-env.config.js)}',
    },
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            PG_HOST: '${self:custom.dotenvVars.PG_HOST}',
            PG_PORT: '${self:custom.dotenvVars.PG_PORT}',
            PG_DATABASE: '${self:custom.dotenvVars.PG_DATABASE}',
            PG_USERNAME: '${self:custom.dotenvVars.PG_USERNAME}',
            PG_PASSWORD: '${self:custom.dotenvVars.PG_PASSWORD}',
            SNS_ARN: '${self:custom.dotenvVars.SNSARN}',
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: 'sqs:*',
                        Resource: '${self:custom.dotenvVars.SQSARN}',
                    },
                    {
                        Effect: 'Allow',
                        Action: 'sns:*',
                        Resource: '${self:custom.dotenvVars.SNSARN}',
                    },
                ],
            },
        },
        lambdaHashingVersion: '20201221',
    },
    functions: microserviceConfig,
};

module.exports = serverlessConfiguration;
