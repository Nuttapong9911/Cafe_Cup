const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  userID: {type: Number},
  shopID: {type: Number},
  menuID: {type: Number},
  flavourScore: {type: Number}, 
  placeScore: {type: Number}, 
  serviceScore: {type: Number}, 
  parkingScore: {type: Number},
  worthinessScore: {type: Number},
  comment: {type: String},
  timestamp: {type: Date}
}, {
  versionKey: false
})

module.exports = mongoose.model('review',reviewSchema)