var mongoose = require('mongoose')

var chickSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
    eat: Boolean,               // 进食状态
    eatTime: Number,            // 喂食时长
    eatEndTime: Number          // 进食结束时间
})

// users 为指定的collections集合
module.exports = mongoose.model('Chick', chickSchema, 'chick')