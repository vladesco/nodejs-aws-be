import { HttpStatusCode, RecursivePartial } from '@nodejs/aws-be/types';
import { SQSEvent } from 'aws-lambda';
import { initCatalogBatchProcessLambda } from '../../lambdas/catalog-batch-process';
import { ProductService, NotificationService } from '../../services';
import { Product } from '../../types';

jest.mock('../../services/product.service');
jest.mock('../../services/notification.service');

describe('catalog batch process lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let mockProductService: jest.Mocked<ProductService>;
    let mockNotificationService: jest.Mocked<NotificationService>;
    let catalogBatchProcessLambda: Function;

    beforeEach(() => {
        (ProductService as any).mockClear();
        (NotificationService as any).mockClear();

        catalogBatchProcessLambda = initCatalogBatchProcessLambda(
            new ProductService(null),
            new NotificationService(null, null)
        );

        [mockProductService] = (ProductService as any).mock.instances;
        [mockNotificationService] = (NotificationService as any).mock.instances;
    });

    it('should return correct response if error doesn`t occur', async () => {
        const apiEvent: RecursivePartial<SQSEvent> = {
            Records: [],
        };

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
        };

        mockProductService.createListOfProducts.mockResolvedValue([]);

        const lambdaResponse = await catalogBatchProcessLambda(apiEvent);

        expect(lambdaResponse).toEqual(testLambdaResponse);
    });

    it('should call file service to parse file and call message service to publish file content', async () => {
        const testFileContent = {
            id: 'test',
            title: 'test',
            description: 'test',
            image: 'test',
            price: 0,
            count: 0,
        } as Product;

        const apiEvent: RecursivePartial<SQSEvent> = {
            Records: [
                {
                    body: JSON.stringify(testFileContent),
                },
            ],
        };

        mockProductService.createListOfProducts.mockResolvedValue([testFileContent]);
        await catalogBatchProcessLambda(apiEvent);

        expect(mockProductService.createListOfProducts).toHaveBeenCalledWith([
            testFileContent,
        ]);

        expect(mockNotificationService.notificate).toHaveBeenCalledWith(
            'new product was created',
            testFileContent,
            {
                count: {
                    DataType: 'Number',
                    StringValue: String(testFileContent.count),
                },
            }
        );
    });

    it('should return correct response if error will occur', async () => {
        const errorMessage = 'test error message';

        const apiEvent: RecursivePartial<SQSEvent> = {
            Records: [],
        };

        const defaultErrorResponse = {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            body: errorMessage,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        };

        mockProductService.createListOfProducts.mockRejectedValueOnce(
            new Error(errorMessage)
        );

        const lambdaResponse = await catalogBatchProcessLambda(apiEvent);

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
