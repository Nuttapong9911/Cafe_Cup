const express = require('express')
const reviewController = require('../controllers/reviewController')
const reachController = require('../controllers/reachController')
const analyticController = require('../controllers/analyticController')

const router = express.Router()

/**
 * @swagger
 * definitions:
 *   Review:
 *     type: object
 *     required:
 *       - _customerId
 *       - _shopId
 *     properties:
 *       _customerId:
 *         type: number
 *       _shopId:
 *         type: number
 *       menuName:
 *         type: string
 *       flavour:
 *         type: number
 *       place:
 *         type: number
 *       service:
 *         type: number
 *       parking:
 *         type: number
 *       worthiness:
 *         type: number
 *       comment:
 *         type: string
 * 
 *   ReviewOutput:
 *     type: object
 *     properties:
 *       _id:
 *         type: number
 *       _customerId:
 *         type: number
 *       _shopId:
 *         type: number
 *       menuName:
 *         type: string
 *       flavour:
 *         type: number
 *       place:
 *         type: number
 *       service:
 *         type: number
 *       parking:
 *         type: number
 *       worthiness:
 *         type: number
 *       comment:
 *         type: string
 *       timestamp:
 *         type: string
 *         format: date-time
 * 
 *   Reach:
 *     type: object
 *     required:
 *       - _customerId
 *       - _shopId
 *     properties:
 *       _customerId:
 *         type: number
 *       _shopId:
 *         type: number
 * 
 *   ReachOutput:
 *     type: object
 *     properties:
 *       _id:
 *         type: number
 *       _customerId:
 *         type: number
 *       _shopId:
 *         type: number
 *       timestamp:
 *         type: string
 *         format: date-time
 *
 *   ReachCountOutput:
 *     type: object
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         type: array
 *         items:
 *           properties:
 *             _id:
 *               type: number
 *             count:
 *               type: number
 *       totalCount:
 *         type: number
 * 
 *   ReviewScoreOutput:
 *     type: object
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         type: object
 *         properties:
 *           totalFlavour:
 *             type: number
 *           totalPlace:
 *             type: number
 *           totalService:
 *             type: number
 *           totalParking:
 *             type: number
 *           totalWorthiness:
 *             type: number
 *           totalCount:
 *             type: number
 * 
 *   ReviewRankOutput:
 *     type: object
 *     properties:
 *       status:
 *         type: number
 *       data:
 *         type: object
 *         properties: 
 *           flavour:
 *             type: object
 *             properties:
 *               avg:
 *                 type: number
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               shopAvg:
 *                 type: number
 *           place:
 *             type: object
 *             properties:
 *               avg:
 *                 type: number
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               shopAvg:
 *                 type: number
 *           service:
 *             type: object
 *             properties:
 *               avg:
 *                 type: number
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               shopAvg:
 *                 type: number
 *           parking:
 *             type: object
 *             properties:
 *               avg:
 *                 type: number
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               shopAvg:
 *                 type: number
 *           worthiness:
 *             type: object
 *             properties:
 *               avg:
 *                 type: number
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               shopAvg:
 *                 type: number
 *       thisShopReviewNumber:
 *         type: number
 *       allShopreviewNumber:
 *         type: number
 * 
 *   AnalyticTimeBody:
 *     type: object
 *     properties:
 *       year:
 *         type: number
 *       month:
 *         type: number
 *       quarter:
 *         type: number
 *       dayOfWeek:
 *         type: number
 * 
 *   AnalyticRankTimeBody:
 *     type: object
 *     properties:
 *       year:
 *         type: number
 *       month:
 *         type: number
 *       quarter:
 *         type: number
 */

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
 *       summary: create new review
 *       consume:
 *         - application/json
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Review'
 *       responses:
 *         200:
 *           description: return created review
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReviewOutput'
 *         400:
 *           description: error
 */
router.post('/review/create', reviewController.create)

/**
 * @swagger
 * paths:
 *   /review/getById:
 *     get:
 *       summary: get review by _id
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a review, null if not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReviewOutput'
 *         400:
 *           description: error
 */
router.get('/review/getById', reviewController.getById)

/**
 * @swagger
 * paths:
 *   /review/get:
 *     get:
 *       summary: get all reviews
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *         - in: query
 *           name: _customerId
 *           type: number
 *       responses:
 *         200:
 *           description: return array of reviews
 *         400:
 *           description: error
 */
router.get('/review/get', reviewController.get)

/**
 * @swagger
 * paths:
 *   /review/update:
 *     put:
 *       summary:
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       consume:
 *         - application/json
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Review'
 *       responses:
 *         200:
 *           description: return an edited review
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReviewOutput'
 *         400:
 *           description: error
 *     
 */
router.put('/review/update', reviewController.update)

/**
 * @swagger
 * paths:
 *   /review/delete:
 *     delete:
 *       summary: delete review by _id
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a deleted review
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReviewOutput'
 *         400:
 *           description: error
 */
router.delete('/review/delete', reviewController.deleteById)

router.post('/review/getReviewScore', reviewController.getReviewScore)

/**
 * @swagger
 * paths:
 *   /reach/create:
 *     post:
 *       summary: create new reach
 *       consume:
 *         - application/json
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Reach'
 *       responses:
 *         200:
 *           description: create new reach
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReachOutput'
 *         400:
 *           description: error
 */
router.post('/reach/create', reachController.create)

/**
 * @swagger
 * paths:
 *   /reach/getById:
 *     get:
 *       summary: get a reach by _id
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a reach
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReachOutput'
 *         400:
 *           description: error 
 */
router.get('/reach/getById', reachController.getById)

/**
 * @swagger
 * paths:
 *   /reach/get:
 *     get:
 *       summary: get all reach
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *         - in: query
 *           name: _customerId
 *           type: number
 *       responses:
 *         200:
 *           description: return array of reachs
 *         400:
 *           description: error 
 */
router.get('/reach/get', reachController.get)

router.get('/reach/getTopReaches', reachController.getTopReaches)

/**
 * @swagger
 * paths:
 *   /analytic/reachCount:
 *     get:
 *       summary: create analytic graph 1
 *       description: data for generating reach count per hour analytic graph
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *         - in: header
 *           name: token
 *           type: string
 *           required: true
 *         - in: query
 *           name: year
 *           type: number
 *         - in: query
 *           name: quarter
 *           type: number
 *         - in: query
 *           name: month
 *           type: number
 *         - in: query
 *           name: dayOfWeek
 *           type: number
 *       responses:
 *         200:
 *           description: return result._id as hour in a day, result.count as number of reach in that hour
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReachCountOutput'
 *         400:
 *           description: error
 */
router.get('/analytic/reachCount', analyticController.getReachCountPerHours)

/**
 * @swagger
 * paths:
 *   /analytic/reachAge:
 *     get:
 *       summary: create analytic graph 2
 *       description: data for generating age count of reaches analytic graph
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *         - in: header
 *           name: token
 *           type: string
 *           required: true
 *         - in: query
 *           name: year
 *           type: number
 *         - in: query
 *           name: quarter
 *           type: number
 *         - in: query
 *           name: month
 *           type: number
 *         - in: query
 *           name: dayOfWeek
 *           type: number
 *       responses:
 *         200:
 *           description: return result._id as age_label, result.count as number of reach in that label
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReachCountOutput'
 *         400:
 *           description: error 
 *     
 */
router.get('/analytic/reachAge', analyticController.getReachAge)

/**
 * @swagger
 * paths:
 *   /analytic/reviewShopScore:
 *     get:
 *       summary: create analytic graph 3
 *       description: data for generating score for all review types analytic graph
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *         - in: header
 *           name: token
 *           type: string
 *           required: true
 *         - in: query
 *           name: year
 *           type: number
 *         - in: query
 *           name: quarter
 *           type: number
 *         - in: query
 *           name: month
 *           type: number
 *         - in: query
 *           name: dayOfWeek
 *           type: number
 *       responses:
 *         200:
 *           description: total mean score and count means number of calculated reviews
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReviewScoreOutput'
 *         400:
 *           description: error 
 *     
 */
router.get('/analytic/reviewShopScore', analyticController.getReviewScore)

/**
 * @swagger
 * paths:
 *   /analytic/reviewRank:
 *     get:
 *       summary: create analytic graph 4
 *       description: data for generating score rank for each review types analytic graph
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *         - in: header
 *           name: token
 *           type: string
 *           required: true
 *         - in: query
 *           name: year
 *           type: number
 *         - in: query
 *           name: quarter
 *           type: number
 *         - in: query
 *           name: month
 *           type: number
 *       responses:
 *         200:
 *           description: ask me for more info
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/ReviewRankOutput'
 *         400:
 *           description: error 
 *     
 */
router.get('/analytic/reviewRank', analyticController.getReviewRank)

// for test
router.post('/reach/inserttest', reachController.createRandomReach)
router.post('/review/inserttest', reviewController.insertTest)
router.post('/review/insertHighTest', reviewController.insertHighReviewTest)
router.post('/review/insertLowTest', reviewController.insertLowReviewTest)
module.exports = router