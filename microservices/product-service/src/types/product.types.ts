export type ProductDTO = {
    title: string;
    description: string;
    price: number;
    image: string;
    count: number;
};

export type Product = {
    id: string;
} & ProductDTO;
