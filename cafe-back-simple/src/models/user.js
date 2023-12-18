const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
  _userID: { type: Number, unique: true },
  username: { type: String },
  gender: { type: String, enum: [ 'MALE', 'FEMALE' ] },
  age: { type: String, enum: [ 'UNDER_22', '23_TO_40', '41_TO_60', 'AFTER_61' ] }
}, {
  versionKey: false
})

module.exports = mongoose.model('user', userSchema)