const moment = require('moment')
const Log = require('../models/log')

// 新增动态日志
exports.addLog = (req, res) => {
    const newDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const conditions = {
        openId: req.body.userId
    };
    const update = {
        $push: {
            logList: {
                log_title: req.body.log_title,
                log_date: newDate
            }
        }
    };
    const options = {
        new: true,
        upsert: true
    };
    Log.findOneAndUpdate(conditions, update, options, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ "code": 0, 'msg': '添加动态成功', "data":data });
        }
    });
}
