const User = require('../models/user');
const UserStudy = require('../models/userstudy');

// 获取用户学科列表
exports.getUserStudy = (req, res) => {
	console.log("测试题目");
	console.log(req.query);
    UserStudy.find({openId: req.query.userId},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询成功'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
}

