const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  _id: {type: Number},
  _customerId: {type: Number, required: true},
  _shopId: {type: Number, required: true},
  _menuId: {type: Number}, // RECHECK  store menuId or menu name
  flavour: {type: Number, default: 0}, 
  place: {type: Number, default: 0}, 
  service: {type: Number, default: 0}, 
  parking: {type: Number, default: 0},
  worthiness: {type: Number, default: 0},
  comment: {type: String},
  timestamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('review',reviewSchema)