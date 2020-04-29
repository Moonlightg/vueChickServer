var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    pass: String
})

// users 为指定的collections集合
module.exports = mongoose.model('User', userSchema, 'users')