import { HttpStatusCode } from '@nodejs/aws-be/types';
import { initGetProductlistLambda } from '../../lambdas/get-product-list';
import { ProductService } from '../../services';
import { Product } from '../../types';

jest.mock('../../services/product.service');

describe('product list lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let mockProductService: jest.Mocked<ProductService>;
    let getProductListLambda: Function;

    beforeEach(() => {
        (ProductService as any).mockClear();

        getProductListLambda = initGetProductlistLambda(new ProductService(null));
        [mockProductService] = (ProductService as any).mock.instances;
    });

    it('should call product service and return correct response', async () => {
        const testProducts: Product[] = [
            {
                id: 'test',
                title: 'test',
                description: 'test',
                image: 'test',
                price: 0,
                count: 0,
            },
        ];

        const testLambdaResponse = {
            statusCode: HttpStatusCode.OK,
            headers: corsHeaders,
            body: JSON.stringify(testProducts),
        };

        mockProductService.getProducts.mockResolvedValue(testProducts);

        const lambdaResponse = await getProductListLambda({});

        expect(lambdaResponse).toEqual(testLambdaResponse);
        expect(mockProductService.getProducts).toBeCalled();
    });

    it('should return correct response if error will occur', async () => {
        const errorMessage = 'test error message';

        const defaultErrorResponse = {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            body: errorMessage,
            headers: {
                'Content-Type': 'text/plain',
                ...corsHeaders,
            },
        };

        mockProductService.getProducts.mockRejectedValueOnce(new Error(errorMessage));

        const lambdaResponse = await getProductListLambda({});

        expect(lambdaResponse).toEqual(defaultErrorResponse);
    });
});
