const mongoose = require('mongoose')

const customerReachSchema = new mongoose.Schema({
  _id: {type: Number},
  _shopId: {type: Number, required: true},
  _customerId: {type: Number, required: true},
  customerAge: { type: String, enum: [ 'UNDER_22', '23_TO_40', '41_TO_60', 'AFTER_61' ] },
  timestamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('reach', customerReachSchema)