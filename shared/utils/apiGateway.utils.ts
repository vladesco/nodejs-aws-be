export const formatJSONResponse = (response: Record<string, any>) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};
