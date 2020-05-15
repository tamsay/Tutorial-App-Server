const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')

let Student = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value)=>{
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true,
    } 
    },
    {timestamps: true}
);

module.exports = mongoose.model('user', Student);