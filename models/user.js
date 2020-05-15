const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator')

let User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: (value)=>{
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'student',
        enum: ['student', 'tutor', 'admin'],
    },
    accessToken: {
        type: String,
    } 
    },
    {timestamps: true}
);

module.exports = mongoose.model('userCollection', User);
