import 'source-map-support/register';
import { formatJSONResponse, middyfy } from '@nodejs/aws-be/utils';
import { LambdaGateway } from '@nodejs/aws-be/types';
import { ProductService } from '../../services';

const lambaConstructor: (productService: ProductService) => LambdaGateway<never, never> =
    (productService: ProductService) =>
        async function getProductList() {
            const products = await productService.getProducts();

            return formatJSONResponse(products);
        };

export const initGetProductlistLambda = (productService: ProductService) =>
    middyfy(lambaConstructor(productService));
