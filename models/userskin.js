var mongoose = require('mongoose')

var skinListSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
	skinList: [
		{
			kid: Number,        // 皮肤分类 1 套装 , 2 帽子, 3 上衣
			list: Array         // 皮肤列表
		}
	]
})

module.exports = mongoose.model('Userskin', skinListSchema, 'userskins')
