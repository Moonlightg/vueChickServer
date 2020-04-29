const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

//const login = require("login");
const userApi = require("../api/user-api");

router.post('/register',userApi.register) //注册
router.post('/login',userApi.login) //登录

module.exports = router;