var mongoose = require('mongoose')

var goodsSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
    name: String,               // 商品名称
    price: Number,              // 单价
    eatTime: Number,            // 进食时间 (单位毫秒)
    exp: Number,                // 增加小鸡经验
    num: Number,                // 库存数量
    exp: Number,                // 进食时间 (单位毫秒)
    unlock: Number,             // 0为待解锁，1为已解锁
    unlockPrice: Number,        // 解锁金额
    img: String        			// 图片
})

// goods 为指定的collections集合
module.exports = mongoose.model('Goods', goodsSchema, 'goods')