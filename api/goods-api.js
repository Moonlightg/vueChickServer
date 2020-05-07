const Good = require('../models/goods')

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
    console.log(req.query);
    // Good.find({},(err,data) => {
    //     if (err) {
    //         res.send({'code': 0, 'msg': '查询失败', 'data': err});
    //     } else {
    //         console.log('查询商品成功'+data)
    //         res.send({ 'code': 1, 'data': data });
    //     }
    // })
}

