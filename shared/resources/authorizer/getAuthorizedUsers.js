const { config } = require('dotenv');
const path = require('path');

module.exports = () => {
    const configPath = path.resolve(__dirname, './.env');

    const { parsed: variables } = config({ path: configPath });

    return variables;
};
