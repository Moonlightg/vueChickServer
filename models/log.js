var mongoose = require('mongoose')

var logSchema = new mongoose.Schema({
	openId: String,                 // 用户唯一标示,_id
	logList: [						// 日志列表
		{
			log_type: Number,       // 日志类型 (0:注册账号,1:登陆,2:退出登陆,3:解锁商品,4:购买商品,5:领取任务奖励,6:投喂食物)
			log_title: String,      // 日志描述
			log_date: String        // 日志时间
		}
	]
	
})

// users 为指定的collections集合
module.exports = mongoose.model('Log', logSchema, 'log')