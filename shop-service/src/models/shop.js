const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  country: { type: String },
  province: { type: String },
  district: { type: String },
  subDistrict: { type: String },
  road: { type: String },
  postelCode: { type: String },
  addressText: { type: String }
})

const menuSchema = new mongoose.Schema({
  name: { type: String },
  category: { type: String },
  description: { type: String },
  price: { type: Number },
  image: { type: String }
})

const shopImageSchema = new mongoose.Schema({
  shopImages: [String],
  menuImages: [String],
  foodImages: [String],
  otherImages: [String],
})

const shopSchema = new mongoose.Schema({
  _shopID: { type: Number, unique: true, require: true },
  name: { type: String, require: true },
  description: { type: String },
  address: addressSchema,
  menus: [menuSchema],
  shopImages: shopImageSchema,
  daysOpen: [Number],
  tiemOpen: { type: String }, //00:00 to 23:59
  timeClose: { type: String }, //00:00 to 23:59
  singleSeat: { type: Number,  default: 0 },
  doubleSeat: { type: Number,  default: 0  },
  largeSeat: { type: Number,  default: 0  },
  wifi: { type: Boolean, default: false },
  outletsCharge: { type: Boolean, default: false  },
  conferenceRoom: { type: Boolean, default: false  },
  photoSpots: { type: String, enum: ['FEW', 'MEDIUM', 'MUCH'] },
  shopType: { type: String, enum: ['INDOOR', 'OUTDOOR', 'MIXED'] },
  zoneProvided: { type: String, enum: ['QUITE', 'NORMAL', 'BOTH'] }
},{
  versionKey: false
})

module.exports = mongoose.model('shop', shopSchema)