import 'source-map-support/register';
import { middyfy } from '@nodejs/aws-be/utils';
import { HttpStatusCode, LambdaS3 } from '@nodejs/aws-be/types';
import { FileService, MessageService } from '../../services';

const lambaConstructor: (
    fileService: FileService,
    messageService: MessageService
) => LambdaS3 = (fileService, messageService) =>
    async function parseFileLambda(event) {
        await Promise.all(
            event.Records.map(async (record) => {
                const fileKey = record.s3.object.key;
                const content = await fileService.parseFileContent(fileKey);

                console.log(`parsed file content ${JSON.stringify(content)}`);
                content.forEach((row) => messageService.publish(row));

                await fileService.moveFileToStashFolder(fileKey);
            })
        );

        return { statusCode: HttpStatusCode.OK };
    };

export const initParseFileLambda = (
    fileService: FileService,
    messageService: MessageService
) => middyfy(lambaConstructor(fileService, messageService));
