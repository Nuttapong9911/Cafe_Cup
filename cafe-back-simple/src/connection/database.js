const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

exports.connect = (() => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    dbName: 'Test',
})
.then(() => {
    console.log("connected to database Test successfully!")
})
.catch((error) => {
    console.log("Error connecting to database Test")
    console.error(error)
    process.exit(1)
})
})