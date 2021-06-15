import 'source-map-support/register';
import { middyfy } from '@nodejs/aws-be/utils';
import { HttpStatusCode, LambdaS3 } from '@nodejs/aws-be/types';
import { FileService } from '../../services';

const lambaConstructor: (
    service: FileService,
    uploadFilesFolder: string,
    parsedFilesFolder: string
) => LambdaS3 = (service, uploadFilesFolder, parsedFilesFolder) =>
    async function parseFileLambda(event) {
        await Promise.all(
            event.Records.map(async (record) => {
                const fileKey = record.s3.object.key;

                await service.logFileContent(fileKey);
                await service.moveFileFromFirstFolderToSecond(
                    fileKey,
                    uploadFilesFolder,
                    parsedFilesFolder
                );
            })
        );

        return { statusCode: HttpStatusCode.OK };
    };

export const initParseFileLambda = (
    service: FileService,
    uploadFilesFolder: string,
    parsedFilesFolder: string
) => middyfy(lambaConstructor(service, uploadFilesFolder, parsedFilesFolder));
