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
    let openId = req.body.userId;
    let type = parseInt(req.body.type);
    let price = parseInt(req.body.price) * parseInt(req.body.num);
    const conditions = {
        openId: openId,
        name: req.body.name
    };
    // 查询商品并更新数据
    userGood.findOneAndUpdate(conditions,{
        $inc:{
            num: req.body.num
        }}, {new:true}, (err,data) => {
        if (err) {
            res.send({'code': 1, 'msg': '查询失败', 'data': err});
        } else {
            if (type == 1) {
                User.findByIdAndUpdate(openId,{
                    $inc:{
                        money: -price
                    }}, (err,docs) => {
                        if(err) {
                            console.log('更新失败');
                            return;
                        } else {
                            console.log('更新成功');
                        }
                });
            } else {
                User.findByIdAndUpdate(openId,{
                    $inc:{
                        gem: -price
                    }}, (err,docs) => {
                        if(err) {
                            console.log('更新失败');
                            return;
                        } else {
                            console.log('更新成功');
                        }
                });
            }
            res.json({ 'code': 0, 'msg': '购买成功', 'data': data });
        }
    });
}

// 出售物品
exports.sellFood = (req, res) => {
    console.log("出售物品的数据");
    console.log(req.body);
    let newData = {};
    let sellNum = parseInt(req.body.num);
    let openId = req.body.userId;
    let type = parseInt(req.body.type);
    let price = parseInt(req.body.price) * parseInt(req.body.num);
    const conditions = {
        openId: req.body.userId,
        name: req.body.name
    };
    userGood.findOneAndUpdate(conditions,{
        $inc:{
            num: -sellNum
        }},{
            new: true
        },(err,data) => {
        if (err) {
            res.json({'code': 1, 'msg': '查询失败', 'data': err});
        } else {
            newData = data;
            if (type == 1) {
                User.findByIdAndUpdate(openId,{
                    $inc:{
                        money: price
                    }}, (err,docs) => {
                        if(err) {
                            console.log('更新失败');
                            return;
                        } else {
                            console.log('更新成功');
                        }
                });
            } else {
                User.findByIdAndUpdate(openId,{
                    $inc:{
                        gem: price
                    }}, (err,docs) => {
                        if(err) {
                            console.log('更新失败');
                            return;
                        } else {
                            console.log('更新成功');
                        }
                });
            }
            res.json({'code': 0, 'msg': '出售成功', 'data': newData});         
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

// 收获鸡蛋
exports.postEgg = (req, res) => {
    console.log("req.body");
    console.log(req.body);
    const conditions = {
        openId: req.body.userId,
        name: req.body.name
    };
    userGood.findOne(conditions,(err,data) => {
        if (err) {
            res.json({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询背包食物成功'+data);
            if(data == null) {
                const userEgg = new userGood({
                    openId: req.body.userId,
                    name: req.body.name,
                    type: parseInt(req.body.type),
                    price: parseInt(req.body.price),
                    num: parseInt(req.body.num),
                    img: req.body.img,
                    eatTime : 0,
                    exp : 0,
                    unlock : 0,
                    unlockPrice : 0,
                });
                userEgg.save((err, docs) => {
                    if (err) {
                        res.json({ 'code': 1, 'msg': '收获鸡蛋失败', 'data': err });
                    } else {
                        console.log("收获鸡蛋成功");
                        console.log(docs);
                        res.json({ "code": 0, 'message': '收获鸡蛋成功', "data":docs });
                    }
                });
            } else {
                userGood.findOneAndUpdate(conditions,{$inc:{"num": req.body.num}}, {new:true}, (err,docs) => {
                    if (err) {
                        res.json({'code': 1, 'msg': '收获鸡蛋失败', 'data': err});
                    } else {
                        res.json({ 'code': 0, 'message': '收获鸡蛋成功', 'data': docs });
                    }
                });
            }
        }
    })
}

