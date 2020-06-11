const moment = require('moment')
const Skin = require('../models/skin')
const User = require('../models/user')
const Userskin = require('../models/userskin')
const Chick = require('../models/chick')

// 查询小鸡皮肤数据
exports.getUserSkins = (req, res) => {

    const conditions = {
        openId: req.query.userId
    };
    Userskin.findOne(conditions,(err,data) => {
        if (err) {
            console.log(err);
        } else {
            if (data == null) {
                res.json({ "code": 0, 'msg': '查询皮肤成功', "data":data });
            } else {
                // 循环更新数据
                data.skinList.forEach(item => {
                  item.list.forEach(docs => {
                    if (docs.skinType != 'default' && docs.skinState == 1 ) {
                        updateSkinTime(docs);
                    } else if (docs.skinType != 'default' && docs.skinState == 2) {
                        updateSkinTime(docs);
                    }
                  })
                })

                // 更新皮肤数据
                const upSkin = new Userskin(
                    data
                );
                upSkin.save(function(err, newskin){
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({ "code": 0, 'msg': '查询皮肤成功', "data":newskin });
                    }
                });
            }
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
    let skinType = req.body.skinType;
    let days = parseInt(req.body.days);
    let gem  = parseInt(req.body.price);
    let date1 = new Date();
    let date2 = new Date(date1);
    date2.setDate(date1.getDate() + days);
    let start_date = moment().format('YYYY-MM-DD HH:mm:ss');    // 皮肤生效开始时间
    let end_date = moment(date2).format('YYYY-MM-DD HH:mm:ss'); // 皮肤到期时间
    const conditions = {
        openId: req.body.userId
    };
    Userskin.findOne(conditions,(err,data) => {
        if (err) {
            console.log(err);
        } else { 
            // 循环更新数据
            data.skinList.forEach(item => {
              item.list.forEach(docs => {
                if(docs.skinType == skinType) {
                    docs.skinState = 1;
                    docs.diff = days + "天";
                    docs.days = days;
                    docs.start_date = start_date;
                    docs.end_date = end_date;
                }
              })
            })
             // 更新皮肤数据
            const upSkin = new Userskin(
                data
            );
            upSkin.save(function(err, newskin){
                if (err) {
                    res.send(err);
                } else {
                    // 更新用户资产(皮肤扣除宝石)
                    User.findByIdAndUpdate(req.body.userId,{
                        $inc:{
                            gem: -gem
                        }}, (err, docs) => {
                        if(err) {
                            console.log(err)
                        } else {
                            console.log("资产更新成功")
                        }
                    })
                    res.json({ "code": 0, 'message': '购买皮肤成功', "data":newskin });
                }
            });
        }
    })
}

// 使用皮肤
exports.postUseSkin = (req, res) => {
    let datas = {};
    let newHat;
    let newClothes;
    let isTZ = false;                       // 是否同步设置套装
    const skinId = parseInt(req.body.skinId); // 皮肤部位 skinId:1 为套装;skinId:2为帽子; skinId:3 为衣服
    const skinType = req.body.skinType;       // 皮肤系列 
    const conditions = {
        openId: req.body.userId
    };
    Chick.findOne(conditions,(err,chick) => {
        if (err) {
            res.send(err);
        } else {
            newHat = chick.skinHat;
            newClothes = chick.skinClothes
            Userskin.findOne(conditions,(err,data) => {
                if (err) {
                    console.log(err);
                } else { 
                    // 当前皮肤为套装
                    if (skinId == 1) {
                        data.skinList.forEach(item => {
                            item.list.forEach(docs => {
                                // 先重置当前使用中的皮肤
                                if(docs.skinState == 2) { 
                                    docs.skinState = 1
                                }
                                // 找到当前系列,设置为使用
                                if(docs.skinType == skinType) {
                                    docs.skinState = 2;
                                    newHat = "Hat"+skinType;
                                    newClothes = "Clothes"+skinType;
                                }
                            })
                        })
                    } else if (skinId == 2) {
                        // 当前皮肤为帽子
                        data.skinList.forEach(item => {
                            item.list.forEach(docs => {
                                // 先重置当前使用中的帽子与套装
                                if(docs.skinId == 2 || docs.skinId == 1) { 
                                    docs.skinState = 1
                                }
                                // 找到当前帽子,设置为使用
                                if(docs.skinId == 2 && docs.skinType == skinType) {
                                    docs.skinState = 2;
                                    newHat = "Hat"+skinType;
                                }
                                // 找到同系列的衣服,如果在使用,则设置该系列套装为使用
                                if(docs.skinId == 3 && docs.skinType == skinType && docs.skinState == 2) {
                                    isTZ = true;
                                }
                            })
                        })
                    } else {
                        // 当前皮肤为衣服
                        data.skinList.forEach(item => {
                            item.list.forEach(docs => {
                                // 先重置当前使用中的衣服与套装
                                if(docs.skinId == 3 || docs.skinId == 1) { 
                                    docs.skinState = 1
                                }
                                // 找到当前衣服,设置为使用
                                if(docs.skinId == 3 && docs.skinType == skinType) {
                                    docs.skinState = 2;
                                    newClothes = "Clothes"+skinType;
                                }
                                // 找到同系列的帽子,如果在使用,则设置该系列套装为使用
                                if(docs.skinId == 2 && docs.skinType == skinType && docs.skinState == 2) {
                                    isTZ = true;
                                }
                            })
                        })
                    }

                    // 设置套装
                    if (isTZ) {
                        data.skinList.forEach(item => {
                            item.list.forEach(docs => {
                                // 激活套装
                                if(docs.skinId == 1 && docs.skinType == skinType) { 
                                    docs.skinState = 2
                                }
                            })
                        })
                    }
                     // 更新皮肤数据
                    const upSkin = new Userskin(
                        data
                    );
                    upSkin.save(function(err, newskin){
                        if (err) {
                            res.send(err);
                        } else {
                            datas.userskin = newskin;
                            Chick.findOneAndUpdate(conditions,{
                                $set:{
                                    skinHat: newHat,
                                    skinClothes: newClothes
                                }}, {new:true}, (err,chickdata) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    datas.chick = chickdata
                                    res.send({ 'code': 0, 'message': '皮肤使用成功', 'data': datas});
                                }
                            });
                        }
                    });
                }
            })
        }
    });
}


// 更新皮肤时间方法
function updateSkinTime(docs) {
    // 判断皮肤时间是否到期,返回新数据
    let new_date =  moment().format('YYYY-MM-DD HH:mm:ss'); // 当前时间
    // 皮肤到期时间先与当前时间做比较,如果过期了返回true, 没过期返回false,没过期然后计算时间差
    let isOverdue = moment(new_date).isAfter(docs.end_date);
    console.log("测试下--"+docs.skinName+"--是否到期--"+ isOverdue);
    if (!isOverdue) {
        // 没有过期就比较时间差
        let date1=moment(new_date);
        let date2=moment(docs.end_date);
        let date3=date2.diff(date1,'minute');//计算相差的分钟数
        let y=Math.floor(date3/60/24);//相差的天数
        let h=Math.floor(date3%(60*24)/60);//计算相差小时后余下的小时数
        let html;
        if (y < 1) {
            html = h+"小时";
        } else {
            html = y+"天"+h+"小时";
        }
        console.log(docs.skinName+"还剩下"+y+"天"+h+"小时");
        docs.diff = html;
        return docs;
    } else {
        // 过期了重置状态"未拥有"
        docs.skinState = 0;
        docs.diff = "";
        return docs;
    }
}
