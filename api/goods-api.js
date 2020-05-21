const User = require('../models/user');
const Good = require('../models/goods');
const userGood = require('../models/usergoods');
const Chick = require('../models/chick');

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
    userGood.find({openId: req.query.userId},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功1'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
}

// 获取用户背包食品列表
exports.getUserFoods = (req, res) => {
    userGood.find({openId: req.query.userId, num: {$gt: 0}},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询背包食物成功'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
}

// 解锁商品
exports.unlock = (req, res) => {
    const good = new userGood({
        openId: req.body.userId,         
        name: req.body.name,              
        type: req.body.type,               
        price: req.body.price,             
        eatTime: req.body.eatTime,            
        exp: req.body.exp,               
        num: 0,               
        unlock: 1,            
        unlockPrice: req.body.unlockPrice,       
        img: req.body.img         
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

// 投喂食物
exports.feeding = (req, res) => {
    let chick = {};
    let obj = {};
    Chick.findOneAndUpdate({openId: req.body.userId},{
        $set:{
            eat: true,
            eatTime: req.body.eatTime,
            eatEndTime: req.body.eatEndTime
        }},{
            new: true
        }, (err, docs) => {
        if(err) {
            console.log('投喂更新失败')
        } else {
            console.log('投喂更新成功');
            chick = docs;
            userGood.findOneAndUpdate({
                openId: req.body.userId, 
                name: req.body.name
            },{
                $set:{
                    num: req.body.num
                }
            },{
                new: true
            }, (err,data) => {
                if (err) {
                    res.send({'code': 0, 'msg': '投喂失败', 'data': err});
                } else {
                    obj.data = data;
                    obj.chick = chick;
                    res.send({ 'code': 1, 'message': '投喂成功', 'data': obj });
                }
            });
        }
    });

}

