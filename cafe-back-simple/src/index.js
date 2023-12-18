const express = require('express')
require('./connection/database').connect()
const routes = require('./routes/index')

const PORT = process.env.APP_PORT

const app = express()
app.use(express.json())
app.use(routes)

app.listen(PORT, (err) => {
  if (err) console.log('Error on server setup')
  console.log(`Serverz is listening on port ${PORT}`)
})