const { config } = require('dotenv');
const path = require('path');
const getSharedVariables = require('./shared/resources/process-env.config');

module.exports = () => {
    const configPath = path.resolve(process.cwd(), './.env');
    const { parsed: variables } = config({ path: configPath });
    const sharedVariables = getSharedVariables();

    return { ...variables, ...sharedVariables };
};
