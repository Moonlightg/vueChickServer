var mongoose = require('mongoose')

var userStudySchema = new mongoose.Schema({
    openId: String,          // 用户唯一标示,_id
    itemList: Array          // 题目分类
})

// userstudy 为指定的collections集合
module.exports = mongoose.model('userStudy', userStudySchema, 'userstudy')