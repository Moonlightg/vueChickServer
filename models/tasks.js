var mongoose = require('mongoose')

var taskSchema = new mongoose.Schema({
	taskId: String,             // 任务id
	taskTitle: String,          // 任务描述
	taskType:Number,            // 任务类型, 0登录,1喂食次数,2其他
  	state: Number,			    // 任务完成状态,0,1,2 未完成,已完成,已领取
  	currCount: Number,     		// 当前已完成数量 - 进度
    needCount: Number,			// 满足条件的数量
    rewardMoney: Number,   		// 奖励金币  
    rewardGem: Number			// 奖励宝石  
})

// users 为指定的collections集合
module.exports = mongoose.model('Task', taskSchema, 'tasks')