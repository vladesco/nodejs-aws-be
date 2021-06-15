import { HttpStatusCode, RecursivePartial } from '@nodejs/aws-be/types';
import { S3Event } from 'aws-lambda';
import { initParseFileLambda } from '../../lambdas/import-file-parser';
import { FileService } from '../../services';
import { FileServiceConfig } from '../../types';

jest.mock('../../services/file.service');

describe('parse file lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    const testConfig: FileServiceConfig = {
        bucketName: 'test bucket name',
        fileExtension: 'test extension',
        linkExpiredTimeInSec: 0,
    };

    const testUploadFilesFolder = 'test upload files folder';
    const testParsedFilesFolder = 'test parsed files folder';

    let mockFileService: jest.Mocked<FileService>;
    let parseFileLambda: Function;

    beforeEach(() => {
        (FileService as any).mockClear();

        parseFileLambda = initParseFileLambda(
            new FileService(null, testConfig),
            testUploadFilesFolder,
            testParsedFilesFolder
        );

        [mockFileService] = (FileService as any).mock.instances;
    });

    it('should call file service with correct filename and return correct response', async () => {
        const testFileKey = 'test file key';

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

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
        };

        const lambdaResponse = await parseFileLambda(apiEvent);

        expect(lambdaResponse).toEqual(testLambdaResponse);
        expect(mockFileService.logFileContent).toBeCalledWith(testFileKey);
        expect(mockFileService.moveFileFromFirstFolderToSecond).toBeCalledWith(
            testFileKey,
            testUploadFilesFolder,
            testParsedFilesFolder
        );
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

        mockFileService.logFileContent.mockRejectedValue(new Error(errorMessage));

        const lambdaResponse = await parseFileLambda(apiEvent);

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
