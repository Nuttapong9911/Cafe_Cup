const express = require('express')
const reviewController = require('../controllers/reviewController')
const reachController = require('../controllers/reachController')
const analyticController = require('../controllers/analyticController')

const router = express.Router()

/**
 * @swagger
 * paths:
 *   /livez:
 *     get:
 *       summary: server healthcheck
 *       responses:
 *         200:
 *           description: sever is running.
 *         400:
 *           description: server error.
 *      
 */
router.get('/livez', async (req, res) => res.status(200).json({ status: "ok" }))

/**
 * @swagger
 * paths:
 *   /review/create:
 *     post:
 *     
 */
router.post('/review/create', reviewController.create)

/**
 * @swagger
 * paths:
 *   /review/getById:
 *     get:
 *     
 */
router.get('/review/getById', reviewController.getById)

/**
 * @swagger
 * paths:
 *   /review/get:
 *     get:
 *     
 */
router.get('/review/get', reviewController.get)

/**
 * @swagger
 * paths:
 *   /review/update:
 *     put:
 *     
 */
router.put('/review/update', reviewController.update)

/**
 * @swagger
 * paths:
 *   /review/delete:
 *     delete:
 *     
 */
router.delete('/review/delete', reviewController.deleteById)

/**
 * @swagger
 * paths:
 *   /reach/create:
 *     post:
 *     
 */
router.post('/reach/create', reachController.create)

/**
 * @swagger
 * paths:
 *   /reach/getById:
 *     get:
 *     
 */
router.get('/reach/getById', reachController.getById)

/**
 * @swagger
 * paths:
 *   /reach/get:
 *     get:
 *     
 */
router.get('/reach/get', reachController.get)

/**
 * @swagger
 * paths:
 *   /analytic/reachCount:
 *     get:
 *     
 */
router.get('/analytic/reachCount', analyticController.getReachCountPerHours)

/**
 * @swagger
 * paths:
 *   /analytic/reachAge:
 *     get:
 *     
 */
router.get('/analytic/reachAge', analyticController.getReachAge)

/**
 * @swagger
 * paths:
 *   /analytic/reviewShopScore:
 *     get:
 *     
 */
router.get('/analytic/reviewShopScore', analyticController.getReviewScore)

/**
 * @swagger
 * paths:
 *   /analytic/reviewRank:
 *     get:
 *     
 */
router.get('/analytic/reviewRank', analyticController.getRevieweRank)

// for test
router.post('/reach/inserttest', reachController.createRandomReach)
router.post('/review/inserttest', reviewController.insertTest)
module.exports = router