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
 *       _menuId:
 *         type: number
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
 *         responses:
 *           200:
 *             description: create new review
 *           400:
 *             description: error
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
 *           description: return a review
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
 *       responses:
 *         200:
 *           description: return all reviews
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
 *         400:
 *           description: error
 */
router.delete('/review/delete', reviewController.deleteById)

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
 *       responses:
 *         200:
 *           description: return all reachs
 *         400:
 *           description: error 
 */
router.get('/reach/get', reachController.get)

/**
 * @swagger
 * paths:
 *   /analytic/reachCount:
 *     get:
 *       summary: create analytic graph 1
 *       description: return a data shown reach count for each hour in the given time
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a data for visualize graph
 *         400:
 *           description: error 
 *     
 */
router.get('/analytic/reachCount', analyticController.getReachCountPerHours)

/**
 * @swagger
 * paths:
 *   /analytic/reachAge:
 *     get:
 *       summary: create analytic graph 2
 *       description: return a data shown reach age in the given time
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a data for visualize graph
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
 *       description: return a data shown review score count for each hour in the given time
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a data for visualize graph
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
 *       description: return a data shown review score count in the given time
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a data for visualize graph
 *         400:
 *           description: error 
 *     
 */
router.get('/analytic/reviewRank', analyticController.getRevieweRank)

// for test
router.post('/reach/inserttest', reachController.createRandomReach)
router.post('/review/inserttest', reviewController.insertTest)
module.exports = router