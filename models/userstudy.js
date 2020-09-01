var mongoose = require('mongoose')

var userStudySchema = new mongoose.Schema({
    openId: String,             // 用户唯一标示,_id
    id: Number,                 // 题目种类id
    name: String,               // 题目种类名称
    finish: Boolean,            // 是否完成 (true/false)
    plan: Number,               // 进度 %
    chapterList: []            // 题目分类
})

// userstudy 为指定的collections集合
module.exports = mongoose.model('userStudy', userStudySchema, 'userstudy')