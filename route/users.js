var express = require('express')
var router = express.Router()

var User = require('../models/user')

// 新增一条数据 接口为add
router.post('/register', (req, res) => {
    //查询数据库中name= req.body.name 的数据
    User.find({name: req.body.name},(err,data) => {
        if(err){
            res.send({'status': 1002, 'message': '查询失败', 'data': err});
        }else{
            console.log('查询成功'+data)
            //data为返回的数据库中的有相同name的集合
            if(data.length > 0) {
                res.send({'status': 1001, 'message': '该用户名已经注册！'});
            } else {
                const user = new User({
                    name: req.body.name,
                    pass: req.body.pass,
                    nickName: req.body.nickName
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

//查询用户接口
router.post('/validate', (req, res) => {
    User.findOne({name: req.body.name, pass: req.body.pass, nickName: req.body.nickName}, (err, user) => {
        if (err) {
            console.log(err)
        }
        console.log("-------");
        console.log(req.body);
        console.log("-------");
        res.json(user)
    })
});

module.exports = router