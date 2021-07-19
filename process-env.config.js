const { config } = require('dotenv');
const path = require('path');

module.exports = () => {
    const configPath = path.resolve(process.cwd(), './.env');
    const { parsed: variables } = config({ path: configPath });

    return variables;
};
