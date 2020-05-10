const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

//const login = require("login");
const userApi = require("../api/user-api");
const goodsApi = require("../api/goods-api");

router.post('/register',userApi.register) //注册
router.post('/login',userApi.login) //登录
router.get('/getGoods',goodsApi.getGoods) //获取默认商品列表
router.get('/getUserGoods',goodsApi.getUserGoods) //获取用户商品列表
router.post('/unlock',goodsApi.unlock) //解锁商品


module.exports = router;