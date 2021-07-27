import { HttpStatusCode, RecursivePartial } from '@nodejs/aws-be/types';
import { S3Event } from 'aws-lambda';
import { initParseFileLambda } from '../../lambdas/import-file-parser';
import { FileService, MessageService } from '../../services';

jest.mock('../../services/file.service');
jest.mock('../../services/message.service');

describe('parse file lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let mockFileService: jest.Mocked<FileService>;
    let mockMessageService: jest.Mocked<MessageService>;
    let parseFileLambda: Function;

    beforeEach(() => {
        (FileService as any).mockClear();
        (MessageService as any).mockClear();

        parseFileLambda = initParseFileLambda(
            new FileService(null, null),
            new MessageService(null, null)
        );

        [mockFileService] = (FileService as any).mock.instances;
        [mockMessageService] = (MessageService as any).mock.instances;
    });

    it('should return correct response if error doesn`t occur', async () => {
        const apiEvent: RecursivePartial<S3Event> = {
            Records: [
                {
                    s3: {
                        object: {
                            key: null,
                        },
                    },
                },
            ],
        };

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
        };

        mockFileService.parseFileContent.mockResolvedValue([]);

        const lambdaResponse = await parseFileLambda(apiEvent);

        expect(lambdaResponse).toEqual(testLambdaResponse);
    });

    it('should call file service to parse file and call message service to publish file content', async () => {
        const testFileKey = 'test file key';
        const testFileContent = {};
        const apiEvent: RecursivePartial<S3Event> = {
            Records: [
                {
                    s3: {
                        object: {
                            key: testFileKey,
                        },
                    },
                },
            ],
        };

        mockFileService.parseFileContent.mockResolvedValue([testFileContent]);
        await parseFileLambda(apiEvent);

        expect(mockFileService.parseFileContent).toHaveBeenCalledWith(testFileKey);
        expect(mockMessageService.publish).toHaveBeenCalledWith(testFileContent);
        expect(mockFileService.moveFileToStashFolder).toHaveBeenCalledWith(testFileKey);
    });

    it('should return correct response if error will occur', async () => {
        const errorMessage = 'test error message';
        const apiEvent: RecursivePartial<S3Event> = {
            Records: [
                {
                    s3: {
                        object: {
                            key: null,
                        },
                    },
                },
            ],
        };

        const defaultErrorResponse = {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            body: errorMessage,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        };

        mockFileService.parseFileContent.mockRejectedValue(new Error(errorMessage));

        const lambdaResponse = await parseFileLambda(apiEvent);

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
