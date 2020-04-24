var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    name: String,
    pass: String,
    nickName: String
})

// users 为指定的collections集合
module.exports = mongoose.model('User', userSchema, 'users')