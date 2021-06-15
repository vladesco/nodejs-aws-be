import { HttpStatusCode } from '@nodejs/aws-be/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createProductLambda } from '../../lambdas/get-product-by-id';
import { ProductService } from '../../services';
import { Product } from '../../types';

jest.mock('../../services/product.service');

describe('product lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let productService: ProductService;
    let mockProductService: jest.Mocked<ProductService>;
    let productLambda: Function;

    beforeEach(() => {
        (ProductService as any).mockClear();

        productService = new ProductService(null);
        productLambda = createProductLambda(productService);
        [mockProductService] = (ProductService as any).mock.instances;
    });

    it('should call product service with correct id and return correct response', async () => {
        const testId = 'testId';

        const testProduct: Product = {
            id: 'test',
            title: 'test',
            description: 'test',
            price: 0,
            image: 'test',
        };

        const testResponse = {
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

        const productResponse = await productLambda(apiEvent, null, null);

        expect(productResponse).toEqual(testResponse);
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

        const productResponse = await productLambda(apiEvent, null, null);

        expect(productResponse).toEqual(defaultErrorResponse);
    });
});
