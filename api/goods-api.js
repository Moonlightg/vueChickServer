const Good = require('../models/goods')

// 获取商品列表
exports.getGoods = (req, res) => {
    console.log("测试下获取商品列表");
    //console.log(req);
    //res.json({data: req.body});
    Good.find({},(err,data) => {
        if (err) {
            res.send({'status': 1002, 'message': '查询失败', 'data': err});
        } else {
            console.log('查询商品成功'+data)
            res.send({ 'code': 1, 'data': data });
        }
    })
    //  User.find({username: req.body.username},(err,data) => {
    //     if(err){
    //         res.send({'status': 1002, 'message': '查询失败', 'data': err});
    //     }else{
    //         console.log('查询成功'+data)
    //         //data为返回的数据库中的有相同username的集合
    //         if(data.length > 0) {
    //             res.send({'status': 1001, 'message': '该用户名已经注册！'});
    //         } else {
    //             const user = new User({
    //                 username: req.body.username,
    //                 pass: req.body.pass,
    //                 money: 1000,
    //                 level: 1,
    //                 eat: false,
    //                 eatEndTime: 0
    //             });
    //             user.save((err, docs) => {
    //                 if (err) {
    //                     res.send({ 'code': 1, 'errorMsg': '注册失败' });
    //                 } else {
    //                     res.send({ "code": 0, 'message': '注册成功' });
    //                 }
    //             });
    //         }
    //     }
    // });
}

