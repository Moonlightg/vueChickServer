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
    console.log("领取任务奖励");
    console.log(req.body);
    const taskDocs = {};
    const taskId = req.body.taskId;
    const newDate = moment().format('YYYY-MM-DD');
    console.log("taskId------");
    console.log(taskId);
    const conditions = {
        openId: req.body.userId,
        time: newDate,
        "tasks.tasksId":taskId
    };

    const update = {$set:{"tasks.$.state":2}};
    const options = {new: true};

    // myCollection.findOneAndUpdate({"_id": docId, "steps.name": "foo"},
    // {$set: {"steps.$.state": "P"}})
    userTask.findOneAndUpdate(conditions, update, options, (err, doc) => {
        if (err) {
            res.send({'code': 0, 'msg': '任务领取失败', 'data': err});
        } else {
            // taskDocs.task = doc;
            // const update2 = {$inc:{"money.$":}}
            console.log("-------");
            console.log(doc);
            res.send({ 'code': 1, 'msg': '任务领取成功', 'data':doc });
        }
    })




  //   const addCount = req.body.addCount;
  
  //   const conditions = {
  //       openId: req.query.userId,
  //       time: newDate,
  //       tasks.taskId: taskType
  //   };
  //   const update = {$inc:{"tasks.$.currCount":addCount}};
  //   const update2 = {$set:{"tasks.$.state":1}};
  //   const options = {new: true};

  // userTask.findOneAndUpdate(conditions, update, options, (err, doc) => {
  //   if (err) {
  //     res.send({'code': 0, 'msg': '更新任务失败', 'data': err});
  //   } else {
  //     doc.tasks.forEach((item) => {
  //       if(item.taskId == taskType) {
  //         if( item.currCount >= item.needCount ) {
  //           userTask.findOneAndUpdate(conditions, update2, options, (err, data) => {
  //             console.log("改变完成状态后返回的数据");
  //             console.log(data);
  //             if (err) {
  //               res.send({'code': 0, 'msg': '更新任务失败', 'data': err});
  //             } else {
  //               res.send({ 'code': 1, 'msg': '更新任务成功', 'data':data });
  //             }
  //           });
  //         }
  //         console.log("更新任务次数后返回");
  //         console.log(doc);
  //         res.send({ 'code': 1, 'msg': '更新任务成功', 'data':doc });
  //       }
  //     })
  //   }
  // });
}