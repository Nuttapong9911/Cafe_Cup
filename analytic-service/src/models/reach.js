const mongoose = require('mongoose')

const customerReachSchema = new mongoose.Schema({
  _id: {type: Number},
  _shopId: {type: Number, required: true},
  _customerId: {type: Number, required: true},
  timestamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('reach', customerReachSchema)