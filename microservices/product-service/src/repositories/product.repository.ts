import { Repository } from '@nodejs/aws-be/types';
import { products } from '../consts';
import { Product } from '../types';

export class ProductRepository implements Repository<Product> {
    private products: Product[] = products;

    public async connect(): Promise<boolean> {
        return true;
    }

    public async create(newProduct: Product): Promise<Product> {
        this.products.push(newProduct);
        return newProduct;
    }

    public async update(id: string, newProduct: Product): Promise<Product> {
        const oldProductIndex = this.products.findIndex((product) => product.id === id);

        if (oldProductIndex < 0) {
            return;
        }

        const oldProduct = this.products[oldProductIndex];

        this.products[oldProductIndex] = newProduct;
        return oldProduct;
    }

    public async delete(productId: string): Promise<Product> {
        const deletedProduct = this.products.find((product) => product.id === productId);

        this.products = this.products.filter((product) => product.id !== productId);
        return deletedProduct;
    }

    public async findOne(productId: string): Promise<Product> {
        return this.products.find((product) => product.id === productId);
    }

    public async find(productPattern?: Partial<Product>): Promise<Product[]> {
        if (!productPattern) {
            return this.products;
        }

        const patternFields = Object.entries(productPattern);

        return this.products.filter((product) =>
            patternFields.reduce(
                (isEqual, [key, value]) => isEqual && product[key] === value,
                true
            )
        );
    }
}
