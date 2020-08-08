const mongoose = require('mongoose');

//create schema
const todoschema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('TodoTask',todoschema);