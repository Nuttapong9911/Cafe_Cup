const express = require('express')

const PORT = 3001

const app = express()
app.use(express.json())

app.listen(PORT, (err) => {
  if (err) console.log('Error on server setup')
  console.log(`Server is listening on port ${PORT}`)
})