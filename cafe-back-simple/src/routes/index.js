const express = require('express')
const reachController = require('../controllers/reachController')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/getAll', reachController.getAllReach)
router.get('/getReachHour', reachController.getReachCountPerHours)
router.get('/getReachAge', reachController.getReachAgePerHours)
router.put('/insertOne', reachController.insertOne)
router.put('/insertMany', reachController.insertMany)

router.get('/getUser', userController.getAllUser)
router.put('/insertUser', userController.insertUser)

module.exports = router