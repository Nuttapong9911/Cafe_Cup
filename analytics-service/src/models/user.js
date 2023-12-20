const mongoose = require('mongoose')

const _shopID = new mongoose.Schema({ type: Number })

const userSchema = new mongoose.Schema({
  _userId: { type: Number, unique: true, require: true },
  username: { type: String, require: true },
  gender: { type: String, enum: [ 'MALE', 'FEMALE' ] },
  age: { type: String, enum: [ 'UNDER_22', '23_TO_40', '41_TO_60', 'AFTER_61' ] },
  occupation: { type: String },
  favourites: [_shopID]
}, {
  versionKey: false
})

module.exports = mongoose.model('user', userSchema)