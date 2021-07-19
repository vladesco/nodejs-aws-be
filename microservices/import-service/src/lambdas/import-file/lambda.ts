import 'source-map-support/register';
import { formatTextResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { FileService } from '../../services';

const lambaConstructor: (
    service: FileService,
    uploadFilesFolder: string
) => LambdaGateway<never, { filename: string }, never> = (service, uploadFilesFolder) =>
    async function uploadFileLambda(event) {
        const { filename } = event.queryStringParameters;
        const fileUploadLink = await service.createUploadFileLink(
            filename,
            uploadFilesFolder
        );

        return formatTextResponse(fileUploadLink);
    };

export const initUploadFileLambda = (service: FileService, uploadFilesFolder: string) =>
    middyfy(lambaConstructor(service, uploadFilesFolder));
