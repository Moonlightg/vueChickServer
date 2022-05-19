// var express = require('express')
// var router = express.Router()
const moment = require('moment')
const User = require('../models/user')
const AdminUser = require('../models/adminUser')
const Chick = require('../models/chick')
const Log = require('../models/log')
const jwt = require('jsonwebtoken')
// 密钥
const SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'


var ObjectID = require('mongodb').ObjectID;


// 注册
exports.register = (req, res) => {
    const newDate = moment().format('YYYY-MM-DD HH:mm:ss');
     User.find({username: req.body.username},(err,data) => {
        if(err){
            res.send({'status': 1002, 'msg': '查询失败', 'data': err});
        }else{
            console.log('查询成功'+data)
            //data为返回的数据库中的有相同username的集合
            if(data.length > 0) {
                res.send({'status': 1001, 'msg': '该用户名已经注册！'});
            } else {
                const user = new User({
                    username: req.body.username,
                    pass: req.body.pass,
                    registerDate: newDate,
                    updateDate: newDate,
                    money: 1000,
                    gem: 6480,
                    level: 1,
                    img: "profile.jpg",
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
                            eatFood: '',
                            eggTotal: 0,
                            eggExps: 0,
                            eggNum: 0,
                            eggProgress: 0,
                            eggBase: 50,
                            eggAddExps: 0,
                            skinHat: 'Hatdefault',
                            skinClothes: 'Clothesdefault'
                        });
                        chick.save((err, chick) => {
                            if (err) {
                                res.send({ 'code': 1, 'errorMsg': '创建小鸡失败' });
                            } else {
                                console.log("创建小鸡成功");
                                console.log(chick);
                            }
                        });
                        const log = new Log({
                            openId: docs._id,
                            logList: [{
                                log_type: 0 ,
                                log_title: '注册账号',      // 日志描述
                                log_date: newDate         // 日志时间
                            }]
                        });
                        log.save((err, log) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(log);
                            }
                        });
                        res.send({ "code": 0, 'msg': '注册成功', 'data': docs });
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
        $set:{updateDate:newDate}
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
exports.getUserInfo = (req, res) => {
    console.log("*******************");
    console.log(req.query);
    console.log("*******************");
    User.findOne({"_id": ObjectID(req.query.userId)},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            res.send({'code': 1, 'msg': '查找用户成功', 'data': data });
        }
    })
}
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
        eatFood,
        eggTotal,
        eggExps,
        eggNum,
        eggProgress,
        eggBase,
        eggAddExps,
        skinHat,
        skinClothes
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
            eatFood,
            eggTotal,
            eggExps,
            eggNum,
            eggProgress,
            eggBase,
            eggAddExps,
            skinHat,
            skinClothes
        }},{
            new: true
        }, (err,data) => {
        if (err) {
            res.json({'code': 1, 'msg': '更新小鸡失败', 'data': err});
        } else {
            res.json({'code': 0, 'msg': '更新小鸡成功', 'data': data });
        }
    })
}

exports.postUser = (req, res) => {
    const {
        username,
        pass,
        registerDate,
        updateDate,
        money,
        gem,
        level,
        img,
        eat,
        eatEndTime
    } = req.body
    User.findByIdAndUpdate(req.body.userId,{
        $set:{
            username,
            pass,
            registerDate,
            updateDate,
            money,
            gem,
            level,
            img,
            eat,
            eatEndTime
        }
    },{
        new: true
    }, (err,data) => {
        if(err) {
            console.log(err)
        } else {
            res.json({'code': 0, 'msg': '用户信息更改成功', 'data': data });
        }
    });
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

// 获取好友列表
exports.getFriends = (req, res) => {
    User.find({},(err,data) => {
        if(err) {
            res.json({'code': 1, 'msg': '获取好友列表失败', 'data':err});
        } else {
            updateFriends(data);
            res.json({'code': 0, 'msg': '获取好友列表成功', 'data':data});
        }
    })
}

// 获取当前好友资料(返回用户信息与小鸡信息)
exports.setCurrUser = (req, res) => {
    console.log(req.body);
    let ndate = {};
    let openId = '';
    let name = req.body.name;
    console.log(name);
    User.findOne({username:name},(err,data) => {
        if(err) {
            res.json({'code': 1, 'msg': '获取失败', 'data':err});
        } else {
            openId = data._id;
            ndate.user = data;
            Chick.findOne({openId:openId}, (err,docs) => {
                if (err) {
                    res.json({'code': 1, 'msg': '获取失败', 'data': err});
                } else {
                    ndate.chick = docs;
                    res.json({ 'code': 0, 'msg': '获取成功', 'data': ndate });
                }
            });
        }
    })
}

// 更换用户头像
exports.postProfile = (req, res) => {
    console.log(req.body);
    User.findByIdAndUpdate(req.body.userId,{
        img: req.body.img
    },{
        new:true
    }, (err,data) => {
        if(err) {
            console.log(err)
        } else {
            res.json({ 'code': 0, 'msg': '头像更换成功', 'data': data });
        }
    });
}

// 修改用户名称
exports.setName = (req, res) => {
    console.log(req.body);
    let money = parseInt(req.body.money);
    User.findByIdAndUpdate(req.body.userId,{
        $set:{"username" : req.body.name},
        $inc:{"money": -money}
    },{
        new:true
    }, (err,data) => {
        if(err) {
            console.log(err)
        } else {
            res.json({ 'code': 0, 'msg': '用户名修改成功', 'data': data });
        }
    });
}

// 新增用户留言
exports.addBarrage = (req, res) => {
  console.log('查看留言传过来后台的数据：');
  // console.log(req);
  console.log(req);
  console.log('----------------------------------------');
  console.log(req.body);
  console.log('----------------------------------------');
  console.log(req.body.uid);
  const obj = {
    id: parseInt(req.body.id),
    avatar: req.body.avatar,
    msg: req.body.msg
  }
  console.log(obj);

  const conditions = {
    _id: req.body.uid
  };
  const update = {
    $push: {
      barrage: obj
    }
  };
  const options = {
    new: true,
    upsert: true
  };
  User.findByIdAndUpdate(conditions, update, options, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ "code": 0, 'msg': '添加动态成功', "data":data });
    }
  });
}

// 循环更新好友的进食状态
function updateFriends (data) {
    let loadDate = new Date().getTime();
    data.forEach(item => {
        if(item.eat) {
            let isEat = item.eatEndTime - loadDate;
            if (isEat <= 0) {
              item.eat = false;
            }
        }
    });
    return data;
}


// 后台接口

// admin登录
exports.adminLogin = (req, res) => {
    let newDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let user = {};
    // 判断用户名和密码是否和数据库的相同
    AdminUser.findOneAndUpdate({
        username:req.body.username,
        pass:req.body.pass
    },{
        $set:{updateDate:newDate}
    },{
        new: true
    }, (err, data) => {
        if (err) {
            return res.send({'status': 1002, 'msg': '查询失败', 'data': err});
        } else {
            if(data === null) {
                res.send({'status': 422, 'msg': '后台用户名或密码错误!'});
            } else {
                // 生成token
                const token = jwt.sign({
                    id:String(data._id)
                },SECRET);
                user = data;
                res.send({ 'code': 0, 'msg': '登录后台成功', user, token});
            }
        }
    });
}
// 获取用户列表
exports.getUserList = (req, res) => {
    User.find({},(err,data) => {
        if(err) {
            res.json({'code': 1, 'msg': '获取用户列表失败', 'data':err});
        } else {
            res.json({'code': 0, 'msg': '获取用户列表成功', 'data':data});
        }
    })
}
