const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

require('./connection/mongo').connect()
const PORT = process.env.APP_PORT
const routes = require('./routes/index')

const app = express()
app.use(express.json())
app.use(routes)

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'cafe auth-service API documentation'
     },
     servers: [
      {
        url: `http://localhost:${PORT}`,
      }
    ]
  },
  apis: ['src/routes/index.js']
}

const swaggerSpec = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.listen(PORT, (err) => {
  if (err) console.log('[Shop] Error on server setup')
  console.log(`[Shop] Server is listening on port ${PORT}`)
})
