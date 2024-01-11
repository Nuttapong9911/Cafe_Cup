const express = require('express')
const reviewController = require('../controllers/reviewController')
const reachController = require('../controllers/reachController')

const router = express.Router()

router.get('/livez', async (req, res) => res.status(200).json({ status: "ok" }))

router.post('/review/create', reviewController.create)
router.get('/review/getById', reviewController.getById)
router.get('/review/get', reviewController.get)
router.put('/review/update', reviewController.update)
router.delete('/review/delete', reviewController.deleteById)

router.post('/reach/create', reachController.create)
router.get('/reach/getById', reachController.getById)
router.get('/reach/get', reachController.get)
router.get('/reach/analytic/reachCount', reachController.getReachCountPerHours)
router.get('/reach/analytic/reachAge', reachController.getReachAgePerHours)

router.post('/reach/inserttest', reachController.createRandomReach)

// [ ] routes for analytics

module.exports = router