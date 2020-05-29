const moment = require('moment')
const Task = require('../models/tasks')
const userTask = require('../models/usertasks')
const User = require('../models/user')


// 初始化每天任务
exports.infoTasks = (req, res) => {
    console.log("查询用户任务列表-----");
    console.log(req.body);
    const newDate = moment().format('YYYY-MM-DD');
    const newTask = {};

    userTask.find({openId: req.body.userId,time:newDate},(err, data) => {
        if(err){
            res.send({'status': 1002, 'message': '查询失败', 'data': err});
        }else{
            console.log('查询成功'+data);
            console.log(data);
            console.log(data.length);
            if(data.length == 0) {
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
                                res.send({ "code": 0, 'message': '初始化任务成功', "data":docs });
                            }
                        });
                    }
                });
            } else {
                const newdata = data[0];
                res.send({ "code": 0, 'message': '获取任务成功', "data":newdata });
            }
        }
    });
}

// 领取任务奖励
exports.postReceiveTask = (req, res) => {
    const ndate = {};
    const taskId = req.body.taskId;
    const newDate = moment().format('YYYY-MM-DD');
    const conditions = {
        openId: req.body.userId,
        time: newDate
    };

    userTask.findOne(conditions, function (err, comment) {
        if (err) {
            res.send(err);
        } else {
            //遍历comment.tasks，根据taskId找到想要修改的tasks
            for(var i = 0; i < comment.tasks.length; i++){
                //如果找到了
                if(comment.tasks[i].taskId == taskId){
                    //将state修改为2,任务状态为已领取
                    comment.tasks[i].state = 2;
                    //混合类型因为没有特定约束，
                    //因此可以任意修改，一旦修改了原型，
                    //则必须调用markModified()
                    //传入state，表示该属性类型发生变化
                    comment.markModified('state');
                    //更新任务数据
                    const upTasks = new userTask(
                        comment
                    );

                    // 奖励的金币
                    let rewardMoney = comment.tasks[i].rewardMoney;
                    // 奖励的宝石
                    let rewardGem = comment.tasks[i].rewardGem;

                    upTasks.save(function(err, docs){
                        if (err) {
                            res.send(err);
                        } else {
                            ndate.data = docs;
                            User.findByIdAndUpdate(req.body.userId,{
                                $inc:{
                                    "money":rewardMoney,
                                    "gem":rewardGem
                                }
                            },{
                                new: true
                            }, (err, data) => {
                                if(err) {
                                    console.log(err)
                                } else {
                                    ndate.user = data;
                                    res.json({'code': 0, 'msg': '修改成功！', 'data':ndate});
                                }
                            });
                        }
                    });
                }
            }
        }
    })
}