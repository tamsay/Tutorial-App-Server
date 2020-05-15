const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')

let Course = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
},
{
    subjects: [],
},
    {timestamps: true}
);

module.exports = mongoose.model('categories', Course);