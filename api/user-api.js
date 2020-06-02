// var express = require('express')
// var router = express.Router()
const moment = require('moment')
const User = require('../models/user')
const Chick = require('../models/chick')
const jwt = require('jsonwebtoken')
// 密钥
const SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'


// 注册
exports.register = (req, res) => {
     User.find({username: req.body.username},(err,data) => {
        if(err){
            res.send({'status': 1002, 'message': '查询失败', 'data': err});
        }else{
            console.log('查询成功'+data)
            //data为返回的数据库中的有相同username的集合
            if(data.length > 0) {
                res.send({'status': 1001, 'message': '该用户名已经注册！'});
            } else {
                const user = new User({
                    username: req.body.username,
                    pass: req.body.pass,
                    register_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    money: 1000,
                    gem: 100,
                    level: 1,
                    eat: false,
                    eatEndTime: 0
                });
                user.save((err, docs) => {
                    if (err) {
                        res.send({ 'code': 1, 'errorMsg': '注册失败' });
                    } else {
                        console.log("注册用户成功");
                        console.log(docs);
                        const chick = new Chick({
                            openId: docs._id,
                            exp: 0,
                            upgradeExp: 100,
                            level: 1,
                            eat: false,
                            eatTime: 0,
                            eatEndTime: 0,
                            eggTotal: 0,
                            eggExps: 0,
                            eggNum: 0,
                            eggProgress: 0,
                            eggBase: 50,
                            eggAddExps: 0
                        });
                        chick.save((err, chick) => {
                            if (err) {
                                res.send({ 'code': 1, 'errorMsg': '创建小鸡失败' });
                            } else {
                                console.log("创建小鸡成功");
                                console.log(chick);
                            }
                        });
                        res.send({ "code": 0, 'message': '注册成功', 'data': docs });
                    }
                });
            }
        }
    });
}

// 登录
exports.login = (req, res) => {
    //let obj = {};
    let newDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let user = {};
    let chick = {};
    // 判断用户名和密码是否和数据库的相同
    User.findOneAndUpdate({
        username:req.body.username, 
        pass:req.body.pass
    },{
        $set:{update_date:newDate}
    },{
        new: true
    }, (err, data) => {
        if (err) {
            return res.send({'status': 1002, 'msg': '查询失败', 'data': err});
        } else {
            if(data === null) {
                res.send({'status': 422, 'msg': '用户名或密码错误!'});
            } else {
                // 生成token
                const token = jwt.sign({
                    id:String(data._id)
                },SECRET);
                user = data;
                // 查询小鸡信息
                Chick.find({openId: String(user._id)},(err,docs) => {
                    if (err) {
                        res.send({'code': 1, 'msg': '查询失败', 'data': err});
                    } else {
                        chick = docs[0];
                        res.send({ 'code': 0, 'msg': '登录成功', user, chick, token});
                    }
                })
            }
            
        }
    });
}

// 获取用户信息
// router.get('/users/info',(req, res) => {
//     res.json({data: req.body});
// });

// 获取小鸡状态
exports.getChick = (req, res) => {
    Chick.find({openId: req.query.userId},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            res.send({'code': 1, 'msg': '查找小鸡成功', 'data': data });
        }
    })
}

// 更新小鸡状态
exports.postChick = (req, res) => {
    const {
        openId,             
        exp,                
        upgradeExp,       
        level,             
        eat,               
        eatTime,            
        eatEndTime, 
        eggTotal,        
        eggExps,            
        eggNum,             
        eggProgress,        
        eggBase,            
        eggAddExps         
        } = req.body
    Chick.findOneAndUpdate({openId},{
        $set:{
            openId,             
            exp,                
            upgradeExp,       
            level,             
            eat,               
            eatTime,            
            eatEndTime, 
            eggTotal,        
            eggExps,            
            eggNum,             
            eggProgress,        
            eggBase,            
            eggAddExps 
        }},{
            new: true
        }, (err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '更新小鸡失败', 'data': err});
        } else {
            console.log('查询小鸡成功'+data)
            res.send({'code': 1, 'msg': '更新小鸡成功', 'data': data });
        }
    })
}

// 更新小鸡总产量,重置可获取鸡蛋量为0
exports.postEggNum = (req, res) => {
    const conditions = {
        openId: req.body.userId
    };
    const update = {
        $inc:{"eggTotal": req.body.num},
        $set:{"eggNum": 0}
    };
    const options = {
        new:true
    };
    Chick.findOneAndUpdate(conditions, update, options, (err,docs) => {
        if (err) {
            res.json({'code': 1, 'msg': '更新小鸡总产量失败', 'data': err});
        } else {
            res.json({ 'code': 0, 'msg': '更新小鸡总产量成功', 'data': docs });
        }
    });
}
