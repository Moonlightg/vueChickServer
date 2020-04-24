const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

//const login = require("login");
const register = require("register");

//router.use("/login",login);
router.use("/product",product);

module.exports = router;