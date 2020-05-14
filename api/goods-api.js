const User = require('../models/user');
const Good = require('../models/goods');
const userGood = require('../models/usergoods')

// 获取默认商品列表
exports.getGoods = (req, res) => {
    Good.find({},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
}

// 获取用户商品列表
exports.getUserGoods = (req, res) => {
    const id = req.query.id; // 获取请求传过来的用户id
    console.log(req.query);
    console.log(id);
    userGood.find({openId: id},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功1'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
}

// 解锁商品
exports.unlock = (req, res) => {
    const good = new userGood({
        openId: req.body.userId,
        name: req.body.name,
        num: 0,
        unlock: 1
    });
    User.findByIdAndUpdate(req.body.userId,{
        money: req.body.money
    }, function (err,ret) {
        if(err) {
            console.log('金币更新失败')
        } else {
            console.log('金币更新成功')
        }
    });
    good.save((err, docs) => {
        if (err) {
            res.send({ 'code': 1, 'errorMsg': '解锁失败' });
        } else {
            res.send({ "code": 0, 'message': '解锁成功' });
        }
    });
}

// 购买商品
exports.closingGood = (req, res) => {
    console.log("req.body");
    console.log(req.body);
    // 查询商品并更新数据
    userGood.findOneAndUpdate({openId: req.body.userId, name: req.body.goodName},{$set:{num: req.body.goodNum}}, {new:true}, (err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            res.send({ 'code': 1, 'message': '购买成功', 'data': data });
        }
    });
    User.findByIdAndUpdate(req.body.userId,{
        money: req.body.money
    }, function (err,ret) {
        if(err) {
            console.log('更新失败')
        } else {
            console.log('更新成功')
        }
    });
}

