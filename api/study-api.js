const User = require('../models/user');
const Study = require('../models/study');
const Chick = require('../models/chick');

// 获取用户学科列表
exports.getUserStudy = (req, res) => {
    Study.find({openId: req.query.userId},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功1'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
}

