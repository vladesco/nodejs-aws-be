import { HttpStatusCode } from '@nodejs/aws-be/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { initGetProductLambda } from '../../lambdas/get-product-by-id';
import { ProductService } from '../../services';
import { Product } from '../../types';

jest.mock('../../services/product.service');

describe('product lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let mockProductService: jest.Mocked<ProductService>;
    let getProductByIdLambda: Function;

    beforeEach(() => {
        (ProductService as any).mockClear();

        getProductByIdLambda = initGetProductLambda(new ProductService(null));
        [mockProductService] = (ProductService as any).mock.instances;
    });

    it('should call product service with correct id and return correct response', async () => {
        const testId = 'testId';

        const testProduct: Product = {
            id: 'test',
            title: 'test',
            description: 'test',
            image: 'test',
            price: 0,
            count: 0,
        };

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
            headers: corsHeaders,
            body: JSON.stringify(testProduct),
        };

        const apiEvent: Partial<APIGatewayProxyEvent> = {
            pathParameters: {
                id: testId,
            },
        };

        mockProductService.getProductById.mockResolvedValue(testProduct);

        const lambdaResponse = await getProductByIdLambda(apiEvent);

        expect(lambdaResponse).toEqual(testLambdaResponse);
        expect(mockProductService.getProductById).toBeCalledWith(testId);
    });

    it('should return correct response if error will occur', async () => {
        const errorMessage = 'test error message';

        const apiEvent: Partial<APIGatewayProxyEvent> = {
            pathParameters: {
                id: null,
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

        mockProductService.getProductById.mockRejectedValueOnce(new Error(errorMessage));

        const lambdaResponse = await getProductByIdLambda(apiEvent);

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
