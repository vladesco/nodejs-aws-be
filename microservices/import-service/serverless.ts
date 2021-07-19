import { AWS } from '@serverless/typescript';
import { microseviceConfig } from './src/config';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '2',
    custom: {
        dotenvVars: '${file(../../process-env.config.js)}',
        webpack: {
            webpackConfig: './webpack.config.js',
        },
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
            BUCKET: '${self:custom.dotenvVars.BUCKET}',
            FILE_EXTENSION: '${self:custom.dotenvVars.FILE_EXTENSION}',
            LINK_EXPIRED_TIME_IN_SEC:
                '${self:custom.dotenvVars.LINK_EXPIRED_TIME_IN_SEC}',
            UPLOAD_FILES_FOLDER: '${self:custom.dotenvVars.UPLOAD_FILES_FOLDER}',
            PARSED_FILES_FOLDER: '${self:custom.dotenvVars.PARSED_FILES_FOLDER}',
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: 's3:*',
                        Resource: 'arn:aws:s3:::${self:custom.dotenvVars.BUCKET}/*',
                    },
                ],
            },
        },
        lambdaHashingVersion: '20201221',
    },
    functions: microseviceConfig,
};

module.exports = serverlessConfiguration;
