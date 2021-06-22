import { HttpStatusCode } from '@nodejs/aws-be/types';
import { createProductlistLambda } from '../../lambdas/get-product-list.ts';
import { ProductService } from '../../services';
import { Product } from '../../types';

jest.mock('../../services/product.service');

describe('product list lambda', () => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };

    let productService: ProductService;
    let mockProductService: jest.Mocked<ProductService>;
    let productListLambda: Function;

    beforeEach(() => {
        (ProductService as any).mockClear();

        productService = new ProductService(null);
        productListLambda = createProductlistLambda(productService);
        [mockProductService] = (ProductService as any).mock.instances;
    });

    it('should call product service and return correct response', async () => {
        const testProducts: Product[] = [
            {
                id: 'test',
                title: 'test',
                description: 'test',
                price: 0,
                image: 'test',
            },
        ];

        const testResponse = {
            statusCode: HttpStatusCode.OK,
            headers: corsHeaders,
            body: JSON.stringify(testProducts),
        };

        mockProductService.getProducts.mockResolvedValue(testProducts);

        const productResponse = await productListLambda({}, null, null);

        expect(productResponse).toEqual(testResponse);
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

        const productResponse = await productListLambda({}, null, null);

        expect(productResponse).toEqual(defaultErrorResponse);
    });
});
