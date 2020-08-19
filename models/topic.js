var mongoose = require('mongoose')

var topicSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
    name: String,               // 题目种类名称
    type: Number,               // 题目种类状态,0:未解锁,1:解锁
    plan: String,               // 进度
})

// topic 为指定的collections集合
module.exports = mongoose.model('Topic', topicSchema, 'topic')