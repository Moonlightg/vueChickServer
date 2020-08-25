var mongoose = require('mongoose')

var userStudySchema = new mongoose.Schema({
    openId: String,             // 用户唯一标示,_id
    id: Number,                 // 题目种类id
    name: String,               // 题目种类名称
    finish: Boolean,            // 是否完成 (true/false)
    plan: Number,               // 进度 %
    chapterList: [],            // 进食时间 (单位毫秒)
    exp: Number,                // 增加小鸡经验
    num: Number,                // 库存数量
    unlock: Number,             // 0为待解锁，1为已解锁
    unlockPrice: Number,        // 解锁金额
    img: String        			// 图片
})

// userstudy 为指定的collections集合
module.exports = mongoose.model('userStudy', userStudySchema, 'userstudy')