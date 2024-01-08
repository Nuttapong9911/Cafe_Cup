const mongoose = require('mongoose')

const promotionSchema = new mongoose.Schema({
  _shopId: { type: String, required: true },
  codeString: { type: String },
  dateCreate: { type: Date },
  dateExpired: { type: Date },
  codeDetail: { type: String },
  _customerId: { type: Number },
  status: { type: String },
  usedTimestamp: { type: Date }
})

module.exports = mongoose.model('promotion', promotionSchema)