// const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const reachSchema = new mongoose.Schema({
  _userID: {type: Number, unique: false},
  timeStamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('reach', reachSchema)