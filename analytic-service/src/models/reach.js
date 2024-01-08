const mongoose = require('mongoose')

const customerReachSchema = new mongoose.Schema({
  _shopId: {type: Number},
  _customerId: {type: Number},
  timestamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('reach', customerReachSchema)