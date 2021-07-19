import { LambdaConfig } from '@nodejs/aws-be/types';

export const parseFileLambdaConfig: LambdaConfig = {
    events: [
        {
            s3: {
                event: 's3:ObjectCreated:*',
                bucket: '${self:custom.dotenvVars.BUCKET}',
                rules: [
                    {
                        prefix: '${self:custom.dotenvVars.UPLOAD_FILES_FOLDER}',
                        suffix: '.${self:custom.dotenvVars.FILE_EXTENSION}',
                    },
                ],
                existing: true,
            },
        },
    ],
};
