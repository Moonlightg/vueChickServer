var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,      // 用户名
    pass: String,		   // 密码
    money: Number         // 金币
})

// users 为指定的collections集合
module.exports = mongoose.model('User', userSchema, 'users')