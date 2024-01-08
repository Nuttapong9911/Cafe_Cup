const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  _customerId: {type: Number},
  _shopId: {type: Number},
  _menuId: {type: Number}, // RECHECK  store menuId or menu name
  flavour: {type: Number}, 
  place: {type: Number}, 
  service: {type: Number}, 
  parking: {type: Number},
  worthiness: {type: Number},
  comment: {type: String},
  timestamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('review',reviewSchema)