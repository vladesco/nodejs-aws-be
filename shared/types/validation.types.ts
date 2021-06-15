import Joi from 'joi';

type validatorType<T> = T extends number
    ? Joi.NumberSchema
    : T extends string
    ? Joi.StringSchema
    : T extends { length: number }
    ? Joi.ArraySchema
    : T extends Object
    ? Joi.ObjectSchema
    : Joi.AnySchema;

export type ValidationSchema<T> = {
    [key in keyof T]: validatorType<T[key]>;
};
