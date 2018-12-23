const genMongooSchema = require('../index')();

const schmName = 'users';
const schmOption = null;
const srcCsvPath = './mongodb-schema - users.csv';

console.log(genMongooSchema.genSchema(schmName, schmOption, srcCsvPath));
