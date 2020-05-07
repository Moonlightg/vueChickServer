var mongoose = require('mongoose')

var userGoodsSchema = new mongoose.Schema({
	openId: String,             // 用户唯一标示,_id
    userGoodsList: Array       // 用户商品列表
})

// goods 为指定的collections集合
module.exports = mongoose.model('userGoods', userGoodsSchema, 'usergoods')