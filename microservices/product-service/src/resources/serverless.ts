import { AWS } from '@serverless/typescript';

const resourcesConfiguration: AWS = {
    service: 'product-database',
    frameworkVersion: '2',
    provider: { name: 'aws', region: 'eu-west-1' },
    plugins: ['serverless-export-outputs'],
    custom: {
        dotenvVars: '${file(../../config.js)}',
        exportOutputs: {
            include: ['ENDPOINT', 'PORT'],
            output: {
                file: '../../.env',
                format: 'toml',
            },
        },
    },
    resources: {
        Resources: {
            productStore: {
                Type: 'AWS::RDS::DBInstance',
                Properties: {
                    Engine: 'postgres',
                    DBInstanceIdentifier: 'product-store',
                    DBSecurityGroups: [
                        {
                            Ref: 'productStoreSecurityGroup',
                        },
                    ],
                    MasterUsername: '${self:custom.dotenvVars.PG_USERNAME}',
                    MasterUserPassword: '${self:custom.dotenvVars.PG_PASSWORD}',
                    DBName: '${self:custom.dotenvVars.PG_DATABASE}',
                    DBInstanceClass: 'db.t2.micro',
                    BackupRetentionPeriod: 0,
                    AllocatedStorage: 20,
                    StorageType: 'gp2',
                    PubliclyAccessible: true,
                },
            },
            productStoreSecurityGroup: {
                Type: 'AWS::RDS::DBSecurityGroup',
                Properties: {
                    GroupDescription: 'Ingress for Product Store',
                    DBSecurityGroupIngress: {
                        CIDRIP: '0.0.0.0/0',
                    },
                },
            },
        },
        Outputs: {
            ENDPOINT: {
                Value: {
                    'Fn::GetAtt': ['productStore', 'Endpoint.Address'],
                },
            },
            PORT: {
                Value: {
                    'Fn::GetAtt': ['productStore', 'Endpoint.Port'],
                },
            },
        },
    },
};

module.exports = resourcesConfiguration;
