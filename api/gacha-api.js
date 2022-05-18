const User = require('../models/user');
const userGacha = require('../models/usergacha');

// 获取用户抽卡统计数据
exports.getUserGacha = (req, res) => {
  userGacha.find({openId: req.query.userId},(err,data) => {
    let openId = req.query.userId;
    if (err) {
      res.send({'code': 1, 'msg': '查询用户抽卡统计数据失败', 'data': err});
    } else if (data.length === 0) {
      // 没有抽卡记录，初始化添加记录
      let counter = {         // *** 抽卡计数
        total: null,		  // 总数
        ensureSSR: null,    // 是否大保底 0 | 1
        lastUpSSR: null,
        lastUpSR: null,
        lastSSR: null,
        lastSR: null,
        upSSR: [],
        upSR: [],
        ssr: [],
        sr: []
      };
      let result = {
        ssr: [],
        sr: [],
        r: []
      };
      const usergacha = new userGacha({
        openId: openId,
        counter: counter,
        result: result
      });
      usergacha.save((err, data) => {
        if (err) {
          res.send({ 'code': 1, 'errorMsg': '创建抽卡统计失败' });
        } else {
          console.log("创建抽卡统计成功");
          console.log(data);
          res.send({ 'code': 0, 'msg': '创建抽卡统计成功', 'data': data });
        }
      });
    } else {
      res.send({ 'code': 0, 'msg': '查询用户抽卡统计数据成功', 'data': data[0] });
    }
  })
}

// 添加抽卡统计
exports.setUserGacha = (req, res) => {
  console.log('保存统计测试：');
  console.log(req.body);
  let openId = req.body.userId;
  let price = req.body.countNum * 160;
  let arrA = {         // *** 抽卡计数
    total: null,		  // 总数
    ensureSSR: null,    // 是否大保底 0 | 1
    lastUpSSR: null,
    lastUpSR: null,
    lastSSR: null,
    lastSR: null,
    upSSR: [],
    upSR: [],
    ssr: [],
    sr: []
  };
  let arrB = req.body.counter;
  let result = req.body.result;
  const counter = listAssign(arrA,arrB);
  console.log("对象赋值");
  console.log(counter);
  const conditions = {
    openId: openId
  };
  // 查询抽卡统计并更新数据
  userGacha.find(conditions,(err,data) => {
    if (err) {
      console.log(err);
    } else {
      // 有抽卡记录，进行数据更新
      console.log(data);
      userGacha.findOneAndUpdate(conditions,{
        $set:{
          counter: counter,
          result: result
        }
      },{
        new: true
      }, (err,data) => {
        if (err) {
          res.send({'code': 1, 'msg': '抽卡统计数据保存修改失败', 'data': err});
        } else {
          res.send({ 'code': 0, 'msg': '抽卡统计数据保存修改成功', 'data': data });
        }
      });
    }
  });
  // 扣除原石
  deductMoney(openId,2,price);
}

function listAssign(arrA, arrB) {
  Object.keys(arrA).forEach(key => { arrA[key] = arrB[key] || arrA[key]});
  return arrA;
}

/**
 * deductMoney 扣除资产方法
 * @param openId  用户关联id  类型String
 * @param type    资产类型    类型number
 * @param price   资产额度    类型number
 */
function deductMoney(openId,type,price) {
  if (type == 1) {
    User.findByIdAndUpdate(openId,{
      $inc:{
        money: -price
      }}, (err,docs) => {
      if(err) {
        console.log('更新失败');
        return;
      } else {
        console.log('更新成功');
      }
    });
  } else {
    User.findByIdAndUpdate(openId,{
      $inc:{
        gem: -price
      }}, (err,docs) => {
      if(err) {
        console.log('更新失败');
        return;
      } else {
        console.log('更新成功');
      }
    });
  }
}
