const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

//const login = require("login");
const userApi = require("../api/user-api");
const goodsApi = require("../api/goods-api");
const tasksApi = require("../api/tasks-api");
const logApi = require("../api/log-api");
const skinsApi = require("../api/skins-api");
const studyApi = require("../api/study-api");
const gachaApi = require("../api/gacha-api");

router.post('/register',userApi.register) //注册
router.post('/login',userApi.login) //登录
router.get('/getUserInfo',userApi.getUserInfo) // 刷新页面获取用户相关信息
router.get('/getChick',userApi.getChick) // 获取用户小鸡状态
router.post('/postChick',userApi.postChick) // 更新小鸡信息
router.post('/postUser',userApi.postUser) // 更新用户资料
router.get('/getGoods',goodsApi.getGoods) //获取默认商品列表
router.get('/getUserGoods',goodsApi.getUserGoods) //获取用户商品列表
router.get('/getUserFoods',goodsApi.getUserFoods) //获取用户背包食品列表
router.get('/getUserSkins',skinsApi.getUserSkins) //获取小鸡皮肤数据
router.get('/getUserStudy',studyApi.getUserStudy) // 获取当前用户学习进度 (未完成)
router.post('/infoUserSkins',skinsApi.infoUserSkins) //初始化当前用户小鸡皮肤数据
router.post('/postBdySkin',skinsApi.postBdySkin) // 购买皮肤
router.post('/postUseSkin',skinsApi.postUseSkin) // 使用皮肤
router.post('/unlock',goodsApi.unlock) //解锁商品
router.post('/firstClosingGood',goodsApi.firstClosingGood) // 首次购买某个商品
router.post('/closingGood',goodsApi.closingGood) // 购买商品
router.post('/sellFood',goodsApi.sellFood) // 出售物品
router.post('/feeding',goodsApi.feeding) // 投喂食物
router.post('/postTasks',tasksApi.infoTasks) // 初始化每日任务
router.post('/postReceiveTask',tasksApi.postReceiveTask) // 领取任务奖励
router.post('/addTaskCount',tasksApi.addTaskCount) // 增加任务进度次数
router.post('/postEgg',goodsApi.postEgg) // 收获鸡蛋(物品)
router.post('/postEggNum',userApi.postEggNum) // 收获鸡蛋(总产量),更新小鸡信息
router.post('/addLog',logApi.addLog) // 添加动态日志
router.get('/getLog',logApi.getLog) // 获取动态日志
router.get('/getFriends',userApi.getFriends) // 获取好友列表
router.post('/setCurrUser',userApi.setCurrUser) // 获取当前好友资料
router.post('/postProfile',userApi.postProfile) // 更换用户头像
router.post('/deductionFood',goodsApi.deductionFood) // 扣除物品
router.post('/setName',userApi.setName) // 修改用户名称
router.post('/postLuckDraw',goodsApi.postLuckDraw) // 抽奖
router.post('/addBarrage',userApi.addBarrage) // 添加留言
// 后台接口
router.post('/adminLogin',userApi.adminLogin) //登录
router.get('/getUserList',userApi.getUserList) // 获取用户列表
// 原神抽卡
router.get('/getUserGacha',gachaApi.getUserGacha) //获取用户抽卡统计信息
router.post('/setUserGacha',gachaApi.setUserGacha) //添加用户抽卡统计信息


module.exports = router;
