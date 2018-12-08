const mongoose  = require('mongoose');

const Schema = Mongoose.Schema;

const schema = new Schema({
    name: {type: String , default: '디폴트 값', required: true}, // TODO Test
    decNum: {type: Schema.Types.Decimal128 }, // TODO Test
    name2: [{type: Number}],
    person: {age: {type: Number}, sex: {type: Number}}
} );

mongoose.model('test2', schema);
