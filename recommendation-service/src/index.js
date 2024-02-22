const express = require('express')
require('./connection/mongo').connect()
const routes = require('./routes/index')
const cors = require('cors')
const PORT = process.env.APP_PORT

const app = express()
app.use(express.json())
app.use(routes)
app.use(
  cors()
);
app.listen(PORT, (err) => {
  if (err) console.log('Error on server setup')
  console.log(`Serverz is listening on port ${PORT}`)
})