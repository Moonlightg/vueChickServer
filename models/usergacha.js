var mongoose = require('mongoose')

var userGachaSchema = new mongoose.Schema({
  openId: String,             // 用户唯一标示,_id
  counter: {         // *** 抽卡计数
    total: Number,		  // 总数
    ensureSSR: Number,    // 是否大保底 0 | 1
    lastUpSSR: Number,
    lastUpSR: Number,
    lastSSR: Number,
    lastSR: Number,
    upSSR: Array,
    upSR: Array,
    ssr: Array,
    sr: Array
  },
  result: {
    ssr: Array,
    sr: Array,
    r: Array
  }

})

module.exports = mongoose.model('userGacha', userGachaSchema, 'usergacha')
