var express = require('express')
var router = express.Router()

var User = require('../models/user')

// 注册用户
router.post('/register', (req, res) => {
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