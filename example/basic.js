const genMongooSchema = require('../index')();

const schmName = 'test3';
const schmOption = '{_id: false}';
const srcCsvPath = './ex-data.csv';

console.log(genMongooSchema.genSchema(schmName, schmOption, srcCsvPath));
