const express = require('express')

const shopController = require('../controllers/shopController')
const customerController = require('../controllers/customerController')
const recommendController = require('../controllers/recommendController')
const middlewareAuth = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * definitions:
 *   Shop:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - name
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: object
 *         properties:
 *           country:
 *             type: string
 *           province:
 *             type: string
 *           district:
 *             type: string
 *           subDistrict:
 *             type: string
 *           road:
 *             type: string
 *           postelCode:
 *             type: string
 *           addressText:
 *             type: string
 *       menus:
 *         type: array
 *         items:
 *           properties:
 *             name:
 *               type: string
 *             category:
 *               type: string
 *             price:
 *               type: number
 *             description:
 *               type: string
 *             image:
 *               type: string
 *       coverImage:
 *         type: string
 *       shopImage:
 *         type: array
 *         collectionFormat: csv
 *         items:
 *           type: string
 *       menuImages:
 *         type: array
 *         collectionFormat: csv
 *         items:
 *           type: string
 *       foodImages:
 *         type: array
 *         collectionFormat: csv
 *         items:
 *           type: string
 *       otherImages:
 *         type: array
 *         collectionFormat: csv
 *         items:
 *           type: string
 *       daysOpen:
 *         type: array
 *         collectionFormat: csv
 *         items:
 *           type: number
 *       timeOpen:
 *         type: string
 *       timeClose:
 *         type: string
 *       singleSeat:
 *         type: number
 *       doubleSeat:
 *         type: number
 *       largeSeat:
 *         type: number
 *       wifi:
 *         type: boolean
 *       powerPlugs:
 *         type: boolean
 *       conferenceRoom:
 *         type: boolean
 *       toilet:
 *         type: boolean
 *       smokingZone:
 *         type: boolean
 *       photoSpots:
 *         type: string
 *         enum: ['FEW', 'MEDIUM', 'MUCH']
 *       noice:
 *         type: string
 *         enum: ['QUITE', 'NORMAL']
 *       customerGroup:
 *         type: string
 *         enum: ['STUDENT', 'OFFICE_WORKER', 'TOURIST', 'DIGITAL_NORMAD', 'TAKEAWAY']
 * 
 *   CustomerLogin:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 * 
 *   Customer:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - name
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       name:
 *         type: string
 *       gender:
 *         type: string
 *         enum: [ 'MALE', 'FEMALE' ]
 *       age:
 *         type: string
 *         enum: [ 'UNDER_22', '23_TO_40', '41_TO_60', 'AFTER_61' ]
 *       occupation:
 *         type: string
 *       favourites:
 *         type: array
 *         items:
 *           properties:
 *             _shopID: 
 *               type: number
 *       tags:
 *         type: array
 *         items:
 *            properties:
 *              key:
 *                type: number
 *              value:
 *                type: string
 */


// [ ] task: healthcheck

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
router.get('/livez', async(req, res) => res.status(200).json({ status: 'ok' }))

/**
 * @swagger
 * paths:
 *  /shop/register:
 *    post:
 *      summary: create new shop
 *      consume:
 *        - application/json
 *      requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Shop'
 *      responses:
 *        200:
 *          description: return new registered shop
 *        400:
 *          description: error occurs.
 */
router.post('/shop/register', shopController.register)
// [ ] route: /shop/login

/**
 * @swagger
 * paths:
 *   /shop/getById:
 *     get:
 *       summary: get shop by _shopId
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a shop
 *         400:
 *           description: fetched failed
 */
router.get('/shop/getById', shopController.getById)

/**
 * @swagger
 * paths:
 *   /shop/get:
 *     get:
 *       summary: get all shops
 *       responses:
 *         200:
 *           description: return all shops
 *         400:
 *           description: fetched failed
 */
router.get('/shop/get', shopController.get)

/**
 * @swagger
 * paths:
 *  /shop/update:
 *    put:
 *      summary: edit shop
 *      parameters:
 *        - in: query
 *          name: _id
 *          type: number
 *          required: true
 *      requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Shop'  
 *      responses:
 *        200:
 *          description: return an edited shop
 *        400:
 *          description: error occurs.
 */
router.put('/shop/update', shopController.update)

/**
 * @swagger
 * paths:
 *   /shop/delete:
 *     delete:
 *       summary: delete shop by _shopId
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a deleted shop
 *         400:
 *           description: fetched failed
 */
router.delete('/shop/delete', shopController.deleteByID)

/**
 * @swagger
 * paths:
 *  /customer/register:
 *    post:
 *      summary: create new customer
 *      requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Customer'
 *      responses:
 *        200:
 *          description: return new registered customer
 *        400:
 *          description: error occurs.
 *            
 */
router.post('/customer/register', customerController.register)

/**
 * @swagger
 * paths:
 *   /customer/login:
 *     post:
 *       summary: customer login
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/CustomerLogin' 
 *       responses:
 *         200:
 *           description: return a user with token
 *         400:
 *           description: login failed
 */
router.post('/customer/login', customerController.login)

/**
 * @swagger
 * paths:
 *   /customer/getById:
 *     get:
 *       summary: get a customer by _id
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a customer
 *         400:
 *           description: fetched failed
 */
router.get('/customer/getById', customerController.getById)

/**
 * @swagger
 * paths:
 *   /customer/get:
 *     get:
 *       summary: get all customer
 *       responses:
 *         200:
 *           description: return all customer
 *         400:
 *           description: fetched failed
 */
router.get('/customer/get', customerController.get)

/**
 * @swagger
 * paths:
 *   /customer/update:
 *     put:
 *       summary: edit a customer
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Customer'
 *       responses:
 *         200:
 *           description: return edited customer
 *         400:
 *           description: edit failed
 */
router.put('/customer/update', customerController.update)

/**
 * @swagger
 * paths:
 *   /customer/delete:
 *     delete:
 *       summary: delete customer by _shopId
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return a deleted customer
 *         400:
 *           description: fetched failed
 */
router.delete('/customer/delete', customerController.deleteByID)

// [ ] route: /logout
router.get('/customer/recommend', middlewareAuth, recommendController.calculateShop)

/**
 * @swagger
 * paths:
 *   /customer/recommend:
 *     get:
 *       summary: get recommendation list
 *       parameters:
 *         - in: query
 *           name: _id
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return list of recommended shops
 *         400:
 *           description: error occurs
 */
router.get('/customer/recommend', recommendController.calculateShop)

// for dev
router.post('/shop/inserttest', shopController.randomInsertShop)
router.post('/customer/inserttest', customerController.randCreateCustomer)

module.exports = router