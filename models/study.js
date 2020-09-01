var mongoose = require('mongoose')

var studySchema = new mongoose.Schema({
    id: Number,                 // 题目种类id
    name: String,               // 题目种类名称
    finish: Boolean,            // 是否完成 (true/false)
    plan: Number,               // 进度 %
    chapterList: []             // 题目分类列表
})

// study 为指定的collections集合
module.exports = mongoose.model('Study', studySchema, 'study')