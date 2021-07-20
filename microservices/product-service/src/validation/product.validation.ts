import Joi from 'joi';
import { ValidationSchema } from '@nodejs/aws-be/types';
import { ProductDTO } from '../types';

const productDTOSchema: ValidationSchema<ProductDTO> = {
    title: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string().uri(),
    price: Joi.number().min(0).required(),
    count: Joi.number().min(0).required(),
};

export const productDTOValidtor = Joi.object(productDTOSchema);
