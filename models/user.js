var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,     // 用户名
    pass: String, 		  // 密码
    update_date:String,   // 最近登录时间
    register_date:String, // 注册时间
    money: Number,        // 金币
    gem: Number,          // 宝石
    level: Number,        // 等级
    eat: Boolean,         // 进食状态
    eatEndTime: Number    // 进食结束时间
})

// users 为指定的collections集合
module.exports = mongoose.model('User', userSchema, 'users')