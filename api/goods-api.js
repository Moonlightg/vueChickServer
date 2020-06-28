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
    let openId = req.body.userId;
    let name = req.body.name;
    let type = parseInt(req.body.type);
    let num = parseInt(req.body.num);
    let price = parseInt(req.body.price) * num;
    const conditions = {
        openId: openId,
        name: name
    };
    // 查询商品并更新数据
    userGood.findOneAndUpdate(conditions,{
        $inc:{
            num: num
        }}, {new:true}, (err,data) => {
        if (err) {
            res.send({'code': 1, 'msg': '查询失败', 'data': err});
        } else {
            console.log("测试下第一次购买商品");
            console.log(data);
            if (data == null) {
                res.json({ 'code': 2, 'msg': '当前用户没有该商品需要创建'});
            } else {
                deductMoney(openId,type,price);
                res.json({ 'code': 0, 'msg': '购买成功', 'data': data });
            }
        }
    });
}

// 扣除物品
exports.deductionFood = (req, res) => {
    let openId = req.body.userId;
    let name = req.body.name;
    let num = parseInt(req.body.num);
    const conditions = {
        openId: openId,
        name: name
    };
    userGood.findOneAndUpdate(conditions,{
        $inc:{
            num: -num
        }}, {new:true}, (err,data) => {
        if (err) {
            res.send({'code': 1, 'msg': '扣除失败', 'data': err});
        } else {  
            res.json({ 'code': 0, 'msg': '扣除成功', 'data': data });
        }
    });
}

exports.firstClosingGood = (req, res) => {
    let openId = req.body.userId;
    let name = req.body.name;
    let type = parseInt(req.body.type);
    let num = parseInt(req.body.num);
    let price = parseInt(req.body.price) * num;
    Good.findOne({name:name},(err,data) => {
        if (err) {
            res.send({'code': 1, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功'+data);
            const good = new userGood({
                openId: openId,         
                name: name,              
                type: data.type,               
                price: data.price,             
                eatTime: data.eatTime,            
                exp: data.exp,               
                num: num,               
                unlock: data.unlock,            
                unlockPrice: data.unlockPrice,       
                img: data.img         
            });
            good.save((err, docs) => {
                if (err) {
                    console.log('创建新物品失败');
                    return;
                } else {
                    console.log('创建新物品成功');
                    deductMoney(openId,type,price);
                    res.json({ 'code': 0, 'data': docs });
                }
            });
        }
    })
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
    console.log("测试投喂后返回的数据");
    console.log(req.body);
    let chick = {};
    let obj = {};
    Chick.findOneAndUpdate({openId: req.body.userId},{
        $set:{
            eat: true,
            eatTime: req.body.eatTime,
            eatEndTime: req.body.eatEndTime,
            eatFood: req.body.name
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
            User.findByIdAndUpdate(req.body.userId,{
                $set: {
                    eat: true,
                    eatEndTime: req.body.eatEndTime
                }
            }, function (err,ret) {
                if(err) {
                    console.log(err)
                } else {
                    console.log('投喂状态更改成功')
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


/**
 * newUserGood 用户添加新物品方法
 * @param openId  用户关联id  类型String
 * @param name    物品名称    类型String
 * @param num     物品数量    类型number
 */
function newUserGood(openId,name,num){
    let newData = {};
    Good.findOne({name:name},(err,data) => {
        if (err) {
            res.send({'code': 1, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功'+data);
            const good = new userGood({
                openId: openId,         
                name: name,              
                type: data.type,               
                price: data.price,             
                eatTime: data.eatTime,            
                exp: data.exp,               
                num: num,               
                unlock: data.unlock,            
                unlockPrice: data.unlockPrice,       
                img: data.img         
            });
            good.save((err, docs) => {
                if (err) {
                    console.log('创建新物品失败');
                    return;
                } else {
                    console.log('创建新物品成功');
                    //res.json({ 'code': 0, 'data': docs });
                    newData = docs
                }
            });
            res.json({ 'code': 0, 'data': newData });
        }
    })
}

/**
 * deductMoney 扣除资产方法
 * @param openId  用户关联id  类型String
 * @param type    资产类型    类型number
 * @param price   资产额度    类型number
 */
function deductMoney(openId,type,price) {
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
}

