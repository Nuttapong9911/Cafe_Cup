const express = require('express')
const userController = require('../controllers/user')

const router = express.Router()

// user routes
router.get('/user/getAll', userController.getAllUser)
router.put('/user/insertUser', userController.insertOneUser)

module.exports = router