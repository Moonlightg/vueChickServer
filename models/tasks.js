var mongoose = require('mongoose')

var taskSchema = new mongoose.Schema({
	taskId: String,             // 任务id
	taskTitle: String,          // 任务描述
  	state: Boolean,			    // 任务完成状态
})

// users 为指定的collections集合
module.exports = mongoose.model('Task', taskSchema, 'tasks')