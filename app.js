// 引入express模块
var express = require('express')
// 创建app对象
var app = new express()

// 引入 api 路由
var router = require('./route/index')

/* 使用mongoose类库 */
var mongoose = require('mongoose')

/* 链接 vuechick 数据库 */
var url = "mongodb://127.0.0.1:27017/vuechick"

/* 链接 */
mongoose.connect(url)

/* 链接成功 */
mongoose.connection.on('connected',()=>{
    console.log('连接成功')
})

// 链接异常
mongoose.connection.on('error',()=>{
    console.log('error')
})

// 链接断开
mongoose.connection.on('disconnected',()=>{
    console.log('断开连接')
})


const bodyParser = require('body-parser')
app.use(bodyParser.json())
//这个要放在所有的use前面，解析我们的post请求数据
app.use(bodyParser.urlencoded({ extended: false}))

// 解决跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

// 使用
app.get('/',function(req,res){  // 这个  /表示当前根目录  访问的时候直接   localhost:3000
    res.end("hello world !");
})
app.use('/api', router) // 将路由注册到/api的路径下

var port = process.env.PORT || 3000

// 定义服务器启动端口 
app.listen(port)
console.log('app is listening on port: ' + port)

