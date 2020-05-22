var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,     // 用户名
    pass: String, 		  // 密码
    update_date:String,   // 更新时间
    creat_date:String,    // 创建时间
    money: Number,        // 金币
    level: Number,        // 等级
    eat: Boolean,         // 进食状态
    eatEndTime: Number    // 进食结束时间
})

// users 为指定的collections集合
module.exports = mongoose.model('User', userSchema, 'users')