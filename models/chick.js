var mongoose = require('mongoose')

var chickSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
	exp: Number,         		// 经验值
  	upgradeExp: Number,			// 升级所需经验
  	level: Number,       		// 等级
    eat: Boolean,               // 进食状态
    eatTime: Number,            // 喂食时长
    eatEndTime: String,         // 进食结束时间(时间戳)
    eggTotal: Number,           // 总产蛋量
    eggExps: Number,            // 当前鸡蛋经验
    eggNum: Number,             // 鸡蛋待拾取数量
    eggProgress: Number,        // 鸡蛋进度条
    eggBase: Number,            // 鸡蛋生成基数值: 鸡蛋个数*基数 = 生成鸡蛋增加的数值
    eggAddExps: Number          // 每次增加的鸡蛋经验
})

// users 为指定的collections集合
module.exports = mongoose.model('Chick', chickSchema, 'chick')