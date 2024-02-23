const mongoose = require('mongoose')

const promotionSchema = new mongoose.Schema({
  _id: { type: Number },
  _shopId: { type: Number, required: true },
  codeString: { type: String },
  dateCreate: { type: Date },
  dateExpired: { type: Date },
  codeDetail: { type: String },
  _customerId: { type: Number },
  status: { type: String, enum: ['AVAILABLE', 'CLAIMED', 'ACTIVATED', 'EXPIRED'] },
  usedTimestamp: { type: Date }
}, {
  versionKey: false
})

module.exports = mongoose.model('promotion', promotionSchema)