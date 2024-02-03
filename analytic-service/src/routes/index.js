const express = require('express')
const reviewController = require('../controllers/reviewController')
const reachController = require('../controllers/reachController')
const analyticController = require('../controllers/analyticController')

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

router.post('/reach/inserttest', reachController.createRandomReach)
router.post('/review/inserttest', reviewController.insertTest)

// [ ] routes for analytics
router.get('/analytic/reachCount', analyticController.getReachCountPerHours)
router.get('/analytic/reachAge', analyticController.getReachAge)
router.get('/analytic/reviewShopScore', analyticController.getReviewScore)
router.get('/analytic/reviewRank', analyticController.getRevieweRank)

module.exports = router