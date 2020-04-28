var express = require('express')
var router = express.Router()

var User = require('../models/user')
const jwt = require('jsonwebtoken')
// 密钥
const SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'

// 注册
router.post('/register', (req, res) => {
    //查询数据库中username= req.body.username 的数据
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
                    pass: req.body.pass
                });
                user.save((err, docs) => {
                    if (err) {
                        res.send({ 'code': 1, 'errorMsg': '注册失败' });
                    } else {
                        res.send({ "code": 0, 'message': '注册成功' });
                    }
                });
            }
        }
    });
});

//登录
router.post('/login', (req, res) => {
    // 判断用户名和密码是否和数据库的相同
    User.findOne({ username:req.body.username, pass:req.body.pass}, (err, data) => {
        if (err) {
            return res.send({'status': 1002, 'message': '查询失败', 'data': err});
        } else {
            console.log('查询成功'+data);
            if(data === null) {
                res.send({'status': 422, 'message': '用户名或密码错误!'});
            } else {
                // 生成token
                const token = jwt.sign({
                    id:String(data._id)
                },SECRET)

                return res.send({ 'code': 0, message: '登录成功', data: data, token: token});
            }
            
        }
    });
});

module.exports = router