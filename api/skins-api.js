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
