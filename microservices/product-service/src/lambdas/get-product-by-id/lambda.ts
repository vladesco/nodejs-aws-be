import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';

const lambaConstructor: (
    productService: ProductService
) => LambdaGateway<never, never, { id: string }> = (productService: ProductService) =>
    async function getProductLamda(event) {
        const productId = event.pathParameters.id;
        const product = await productService.getProductById(productId);

        return formatJSONResponse(product);
    };

export const initGetProductLambda = (productService: ProductService) =>
    middyfy(lambaConstructor(productService));
