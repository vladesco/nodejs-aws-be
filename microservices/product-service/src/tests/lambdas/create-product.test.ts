import { HttpStatusCode } from '@nodejs/aws-be/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { initCreateProductLambda } from '../../lambdas/create-product';
import { ProductService } from '../../services';
import { Product, ProductDTO } from '../../types';

jest.mock('../../services/product.service');

describe('create product lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let mockProductService: jest.Mocked<ProductService>;
    let createProductLambda: Function;

    beforeEach(() => {
        (ProductService as any).mockClear();

        createProductLambda = initCreateProductLambda(new ProductService(null));
        [mockProductService] = (ProductService as any).mock.instances;
    });

    it('should call product service with correct productDTO and return correct response', async () => {
        const testProductDTO: ProductDTO = {
            title: 'test',
            description: 'test',
            image: 'test',
            count: 0,
            price: 0,
        };

        const createdTestProduct: Product = {
            id: 'test id',
            ...testProductDTO,
        };

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
            headers: corsHeaders,
            body: JSON.stringify(createdTestProduct),
        };

        const apiEvent: Partial<APIGatewayProxyEvent> = {
            body: JSON.stringify(testProductDTO),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        mockProductService.createProduct.mockResolvedValue(createdTestProduct);

        const lambdaResponse = await createProductLambda(apiEvent);

        expect(lambdaResponse).toEqual(testLambdaResponse);
        expect(mockProductService.createProduct).toBeCalledWith(testProductDTO);
    });

    it('should return correct response if error will occur', async () => {
        const errorMessage = 'test error message';

        const apiEvent: Partial<APIGatewayProxyEvent> = {
            body: null,
            headers: {
                'Content-Type': 'application/json',
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

        mockProductService.createProduct.mockRejectedValue(new Error(errorMessage));

        const lambdaResponse = await createProductLambda(apiEvent);

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
