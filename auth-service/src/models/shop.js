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

const shopSchema = new mongoose.Schema({
  _id: { type: Number },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: addressSchema,
  menus: [menuSchema],
  coverImage: { type: String },
  shopImages: [String],
  menuImages: [String],
  foodImages: [String],
  otherImages: [String],
  daysOpen: [Number],
  timeOpen: { type: String }, //00:00 to 23:59
  timeClose: { type: String }, //00:00 to 23:59
  singleSeat: { type: Number,  default: 0 },
  doubleSeat: { type: Number,  default: 0  },
  largeSeat: { type: Number,  default: 0  },
  wifi: { type: Boolean, default: false },
  powerPlugs: { type: Boolean, default: false  },
  conferenceRoom: { type: Boolean, default: false  },
  toilet: { type: Boolean, default: false },
  smokingZone: { type: Boolean, default: false },
  photoSpots: { type: String, enum: ['FEW', 'MEDIUM', 'MUCH'] },
  noice: { type: String, enum: ['QUITE', 'NORMAL'] },
  customerGroup: { type: String, enum: ['STUDENT', 'OFFICE_WORKER', 'TOURIST', 'DIGITAL_NORMAD', 'TAKEAWAY'] }
},{
  versionKey: false
})

module.exports = mongoose.model('shop', shopSchema)