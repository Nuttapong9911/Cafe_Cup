const mongoose = require('mongoose')

const _shopID = new mongoose.Schema({ type: Number })

const tag = new mongoose.Schema({
  key: { type: Number },
  value: { type: String }
})

const customerSchema = new mongoose.Schema({
  _id: { type: Number },
  username: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: [ 'MALE', 'FEMALE' ] },
  age: { type: String, enum: [ 'UNDER_22', '23_TO_40', '41_TO_60', 'AFTER_61' ] },
  occupation: { type: String },
  favourites: [_shopID],
  tags: [tag]
}, {
  versionKey: false
})

module.exports = mongoose.model('customer', customerSchema)