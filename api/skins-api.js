const moment = require('moment')
const Skin = require('../models/skin')
const Userskin = require('../models/userskin')

// 查询小鸡皮肤数据
exports.getUserSkins = (req, res) => {
    const conditions = {
        openId: req.query.userId
    };
    Userskin.findOne(conditions,(err,data) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ "code": 0, 'msg': '查询皮肤成功', "data":data });
        }
    });
}

// 初始化当前用户小鸡皮肤数据
exports.infoUserSkins = (req, res) => {
    const skinList = [
        {
            kid: 1,
            list: [] 
        },{
            kid: 2,
            list: [] 
        },{
            kid: 3,
            list: [] 
        }
    ];

    // 查询皮肤表
    Skin.find({},(err,data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("初始化的皮肤数据:");
            console.log(data);
            data.forEach(item => {
                if( item.skinId == 1 ) {
                    if (item.skinType == 'default') {
                        skinList[0].list.unshift(item);
                    } else {
                        skinList[0].list.push(item);
                    }
                    
                } else if (item.skinId == 2 ) {
                    if (item.skinType == 'default') {
                        skinList[1].list.unshift(item);
                    } else {
                        skinList[1].list.push(item);
                    }
                } else {
                    if (item.skinType == 'default') {
                        skinList[2].list.unshift(item);
                    } else {
                        skinList[2].list.push(item);
                    }
                    
                }
            });

            const userSkin = new Userskin({
                openId: req.body.userId,
                skinList: skinList,
            });
            userSkin.save((err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("初始化的皮肤数据成功");
                    console.log(docs);
                    res.json({ "code": 0, 'message': '初始化的皮肤数据成功', "data":docs });
                }
            });
        }
    })
}

// 购买皮肤
exports.postBdySkin = (req, res) => {
    console.log(req.body);
    let skinName = req.body.skinName;
    let days = parseInt(req.body.days);
    let date1 = new Date();
    let date2 = new Date(date1);
    date2.setDate(date1.getDate() + days);
    console.log("date2");
    console.log(date2);
    let start_date = moment().format('YYYY-MM-DD HH:mm:ss');    // 皮肤生效开始时间
    let end_date = moment(date2).format('YYYY-MM-DD HH:mm:ss'); // 皮肤到期时间
    console.log(start_date);
    console.log(end_date);
    const conditions = {
        openId: req.body.userId
    };
    Userskin.findOne(conditions,(err,data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("查询到的用户小鸡皮肤数据");
            console.log(data);

            // 循环更新数据
            data.skinList.forEach(item => {
              item.list.forEach(docs => {
                if(docs.skinName === skinName) {
                    docs.skinState = 1;
                    docs.days = days;
                    docs.start_date = start_date;
                    docs.end_date = end_date;
                }
              })
            })
             //更新任务数据
            const upSkin = new Userskin(
                data
            );
            upSkin.save(function(err, newskin){
                if (err) {
                    res.send(err);
                } else {
                    res.json({ "code": 0, 'message': '购买皮肤成功', "data":newskin });
                }
            });
            
        }
    })
}
