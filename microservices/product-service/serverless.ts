import { AWS } from '@serverless/typescript';
import { microseviceConfig } from './src/config';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
        },
        dbVariables: '${file(./config.js)}',
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
            PG_HOST: '${self:custom.dbVariables.PG_HOST}',
            PG_PORT: '${self:custom.dbVariables.PG_PORT}',
            PG_DATABASE: '${self:custom.dbVariables.PG_DATABASE}',
            PG_USERNAME: '${self:custom.dbVariables.PG_USERNAME}',
            PG_PASSWORD: '${self:custom.dbVariables.PG_PASSWORD}',
        },
        lambdaHashingVersion: '20201221',
    },
    functions: microseviceConfig,
};

module.exports = serverlessConfiguration;
