var mongoose = require('mongoose')

var taskListSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
	time: String,               // 任务日期
  	tasks: Array,			    // 任务列表
})

// users 为指定的collections集合
module.exports = mongoose.model('userTask', taskListSchema, 'usertasks')