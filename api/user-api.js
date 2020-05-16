// var express = require('express')
// var router = express.Router()

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
                    money: 1000,
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
                            eatEndTime: 0
                        });
                        chick.save((err, chick) => {
                            if (err) {
                                res.send({ 'code': 1, 'errorMsg': '创建小鸡失败' });
                            } else {
                                console.log("创建小鸡成功");
                                console.log(chick);
                                //res.send({ "code": 0, 'message': '创建小鸡成功', 'data': docs });
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
    // 判断用户名和密码是否和数据库的相同
    User.findOne({ username:req.body.username, pass:req.body.pass}, (err, data) => {
        if (err) {
            return res.send({'status': 1002, 'message': '查询失败', 'data': err});
        } else {
            if(data === null) {
                res.send({'status': 422, 'message': '用户名或密码错误!'});
            } else {
                // 生成token
                const token = jwt.sign({
                    id:String(data._id)
                },SECRET)

                return res.send({ 'code': 0, message: '登录成功', data, token});
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
    console.log("req.query");
    console.log(req.query);
    Chick.find({openId: req.query.userId},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询小鸡成功'+data)
            res.send({'code': 1, 'message': '查找小鸡成功', 'data': data });
        }
    })
}
