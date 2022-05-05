var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,     // 用户名
    pass: String, 		  // 密码
    updateDate:String,   // 最近登录时间
    img: String,          // 用户头像
})

// users 为指定的collections集合
module.exports = mongoose.model('AdminUser', userSchema, 'adminuser')
