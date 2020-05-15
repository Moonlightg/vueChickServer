var mongoose = require('mongoose')

var chickSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
	exp: Number,         			// 经验值
  	upgradeExp: Number,			// 升级所需经验
  	level: Number,       			// 等级
    eat: Boolean,               // 进食状态
    eatTime: Number,            // 喂食时长
    eatEndTime: Number          // 进食结束时间
})

// users 为指定的collections集合
module.exports = mongoose.model('Chick', chickSchema, 'chick')