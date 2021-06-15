import joi from 'joi';

export const isUUDValid = (uuid: string): boolean => {
    const validationResult = joi.string().guid({ version: 'uuidv4' }).validate(uuid);

    return !validationResult.error;
};
