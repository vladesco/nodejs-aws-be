import { NotFoundError, BadRequestError } from '@nodejs/aws-be/classes';
import { Repository } from '@nodejs/aws-be/types';
import { Product } from '../types';
import { isUUDValid } from '../validation';

export class ProductService {
    constructor(private productRepository: Repository<Product>) {}

    public async getProductById(productId: string): Promise<Product> {
        if (!isUUDValid(productId)) {
            throw new BadRequestError('product id is invalid');
        }

        const product = await this.productRepository.findOne(productId);

        if (!product) {
            throw new NotFoundError('product with such id not found');
        }

        return product;
    }

    public async getProducts(): Promise<Product[]> {
        const products = await this.productRepository.find();

        if (!products) {
            throw new NotFoundError('products not found');
        }

        return products;
    }
}
