const express = require('express')
require('./connection/mongo').connect()
const PORT = process.env.APP_PORT
const routes = require('./routes/index')

const app = express()
app.use(express.json())
app.use(routes)

app.listen(PORT, (err) => {
  if (err) console.log('[Shop] Error on server setup')
  console.log(`[Shop] Server is listening on port ${PORT}`)
})
