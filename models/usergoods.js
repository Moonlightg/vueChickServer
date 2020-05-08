var mongoose = require('mongoose')

var userGoodsSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
    name: String,               // 商品名称
    num: Number                // 库存数量
})

// usergoods 为指定的collections集合
module.exports = mongoose.model('userGoods', userGoodsSchema, 'usergoods')