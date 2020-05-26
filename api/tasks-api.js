const moment = require('moment')
const Task = require('../models/tasks')
const userTask = require('../models/usertasks')


// 初始化每天任务
exports.infoTasks = (req, res) => {
    console.log("查询用户任务列表-----");
    console.log(req.body);
    const newDate = moment().format('YYYY-MM-DD');
    const newTask = {};

    userTask.find({openId: req.body.userId},(err, data) => {
        if(err){
            res.send({'status': 1002, 'message': '查询失败', 'data': err});
        }else{
            console.log('查询成功'+data)
            if(data.length = 0) {
                Task.find({},(err,tasks) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('查询tasks成功'+tasks)

                        const usertask = new userTask({
                            openId: req.body.userId,
                            time: newDate,
                            tasks: tasks
                        });
                        usertask.save((err, docs) => {
                            if (err) {
                                res.send({ 'code': 1, 'errorMsg': '初始化任务失败' });
                            } else {
                                console.log("初始化每日任务成功");
                                console.log(docs);
                                res.send({ "code": 0, 'message': '初始化任务成功', docs });
                            }
                        });
                    }
                });
            } else {
                console.log(data);
                res.send({ "code": 0, 'message': '获取任务成功', data });
            }
        }
    });
}