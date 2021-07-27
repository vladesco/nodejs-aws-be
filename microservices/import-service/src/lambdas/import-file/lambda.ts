import 'source-map-support/register';
import { formatTextResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { FileService } from '../../services';

const lambaConstructor: (
    fileService: FileService
) => LambdaGateway<never, { filename: string }, never> = (fileService) =>
    async function uploadFileLambda(event) {
        const { filename } = event.queryStringParameters;
        const fileUploadLink = await fileService.createUploadFileLink(filename);

        return formatTextResponse(fileUploadLink);
    };

export const initUploadFileLambda = (service: FileService) =>
    middyfy(lambaConstructor(service));
