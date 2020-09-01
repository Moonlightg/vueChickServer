const User = require('../models/user');
const Study = require('../models/study');
const UserStudy = require('../models/userstudy');

// 获取用户学科列表
exports.getUserStudy = (req, res) => {
	console.log("测试题目");
	console.log(req.query);
    UserStudy.find({openId: req.query.userId},(err,data) => {
        if (err) {
            res.send({'code': 0, 'msg': '查询失败', 'data': err});
        } else {
            console.log('查询成功'+data)
            if(data.length == 0) {
                Study.find({},(err,studys) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('查询Study成功'+studys)
                        const userstudy = new UserStudy({
                            openId: req.body.userId,
                            id: studys.id,             
						    name: studys.name,               
						    finish: studys.finish,        
						    plan: studys.plan,               
						    chapterList: studys.chapterList          
                        });
                        userstudy.save((err, docs) => {
                            if (err) {
                                res.send({ 'code': 0, 'errorMsg': '初始题目列表失败' });
                            } else {
                                console.log("初始题目列表成功");
                                console.log(docs);
                                res.send({ "code": 1, 'message': '初始题目列表成功', "data":docs });
                            }
                        });
                    }
                });
            } else {
                const newdata = data[0];
                res.send({ "code": 1, 'message': '获取题目列表成功', "data":newdata });
            }
        }
    })
}

