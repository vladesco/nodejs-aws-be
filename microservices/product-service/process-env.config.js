const { config } = require('dotenv');
const path = require('path');
const getSharedVariables = require('@nodejs/aws-be/resources');

module.exports = () => {
    const configPath = path.resolve(__dirname, './.env');
    const { parsed: variables } = config({ path: configPath });
    const sharedVariables = getSharedVariables();

    return { ...variables, ...sharedVariables };
};
