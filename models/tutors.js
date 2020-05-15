const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')

let Tutor = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value)=>{
            return validator.isEmail(value)
        }
    },
    password: String,
    required: true,
    },
    {timestamps: true}
);

module.exports = mongoose.model('user', Tutor);