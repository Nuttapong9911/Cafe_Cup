const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI

exports.connect = (() => {
  mongoose.connect(MONGO_URI
    , {
      dbName: process.env.DB_DATABASENAME,
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
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