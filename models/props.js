var mongoose = require('mongoose')

var propsSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
    name: String,               // 道具名称
    describe: String,           // 道具描述
    type: Number,               // 道具类型,1:食物,2:道具
    price: Number,              // 单价
    eatTime: Number,            // 进食时间 (单位毫秒)
    exp: Number,                // 增加小鸡经验
    num: Number,                // 库存数量
    unlock: Number,             // 0为待解锁，1为已解锁
    unlockPrice: Number,        // 解锁金额
    img: String        			// 图片
})

// props 为指定的collections集合
module.exports = mongoose.model('Props', goodsSchema, 'props')