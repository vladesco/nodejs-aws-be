import { HttpStatusCode } from '@nodejs/aws-be/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { initUploadFileLambda } from '../../lambdas/import-file';
import { FileService } from '../../services';

jest.mock('../../services/file.service');

describe('import file lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let mockFileService: jest.Mocked<FileService>;
    let uploadFileLambda: Function;

    beforeEach(() => {
        (FileService as any).mockClear();

        uploadFileLambda = initUploadFileLambda(new FileService(null, null));
        [mockFileService] = (FileService as any).mock.instances;
    });

    it('should call file service with correct filename and return correct response', async () => {
        const testUrl = 'test url';
        const testFilename = 'test file name';

        const apiEvent: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {
                filename: testFilename,
            },
        };

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
            headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
            body: testUrl,
        };

        mockFileService.createUploadFileLink.mockResolvedValue(testUrl);

        const lambdaResponse = await uploadFileLambda(apiEvent);

        expect(lambdaResponse).toEqual(testLambdaResponse);
        expect(mockFileService.createUploadFileLink).toBeCalledWith(testFilename);
    });

    it('should return correct response if error will occur', async () => {
        const errorMessage = 'test error message';

        const apiEvent: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {
                filename: null,
            },
        };

        const defaultErrorResponse = {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            body: errorMessage,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        };

        mockFileService.createUploadFileLink.mockRejectedValueOnce(
            new Error(errorMessage)
        );

        const lambdaResponse = await uploadFileLambda(apiEvent);

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
