var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,     // 用户名
    pass: String, 		  // 密码
    updateDate:String,   // 最近登录时间
    registerDate:String, // 注册时间
    money: Number,        // 金币
    gem: Number,          // 宝石
    level: Number,        // 等级
    img: String,          // 用户头像
    eat: Boolean,         // 进食状态
    eatEndTime: String,    // 进食结束时间
    barrage: [{
      id: Number,
      avatar: String,
      msg: String
    }]    // 留言信息
})

// users 为指定的collections集合
module.exports = mongoose.model('User', userSchema, 'users')
