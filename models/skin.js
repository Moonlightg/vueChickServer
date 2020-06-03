var mongoose = require('mongoose')

var skinSchema = new mongoose.Schema({
	skinId: Number,       // 皮肤所属分类 1 套装 , 2 帽子, 3 上衣
	skinType: String,     // 皮肤系列类型 default 默认系列, forg 青蛙系列
	skinName: String,     // 皮肤名称
	skinState: Number,    // 皮肤状态 0 未拥有, 1 已拥有
	price: Number,        // 价格(宝石)
	start_date: String,   // 激活时间
	end_date: String,     // 到期时间
	days: Number,         // 有效期(天)

})

// users 为指定的collections集合
module.exports = mongoose.model('Skin', skinSchema, 'skins')