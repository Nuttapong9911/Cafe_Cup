const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

exports.connect = (() => {
  mongoose.connect(MONGO_URI
    , {
      dbName: 'cafe',
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
.then(() => {
    console.log("connected to database cafe successfully!")
})
.catch((error) => {
    console.log("Error connecting to database cafe")
    console.error(error)
    process.exit(1)
})
})