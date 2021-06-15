import { NotFoundError, BadRequestError, ValidationError } from '@nodejs/aws-be/classes';
import { Repository } from '@nodejs/aws-be/types';
import { Product, ProductDTO } from '../types';
import { isUUDValid, productDTOValidtor } from '../validation';

export class ProductService {
    constructor(private productRepository: Repository<ProductDTO, Product>) {}

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
        const products = await this.productRepository.findAll();

        if (!products) {
            throw new NotFoundError('products not found');
        }

        return products;
    }

    public async createProduct(newProduct: ProductDTO): Promise<Product> {
        const { error } = productDTOValidtor.validate(newProduct);

        if (error) {
            throw new ValidationError(error.message);
        }

        return this.productRepository.create(newProduct);
    }
}
