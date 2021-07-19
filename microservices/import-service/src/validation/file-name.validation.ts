import joi from 'joi';

export const isFilenameValid = (filename: string, fileExtension: string): boolean => {
    const validationResult = joi
        .string()
        .pattern(new RegExp(`.+(\\.${fileExtension})$`))
        .validate(filename);

    return !validationResult.error;
};
