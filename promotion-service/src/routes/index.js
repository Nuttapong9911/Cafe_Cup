const express = require('express')

const promotionController = require('../controllers/promotionController')
const router = express.Router()

/**
 * @swagger
 * definitions:
 *   CreatePromoInput:
 *     type: object
 *     required:
 *       - _shopId
 *     properties:
 *       _shopId:
 *         type: number
 *       codeDetail:
 *         type: string
 *       expiredLength:
 *         type: number
 *       amount:
 *         type: number
 * 
 *   CreatePromoOutput:
 *     type: array
 *     items:
 *       properties:
 *         _id:
 *           type: number
 *         _shopId:
 *           type: number
 *         codeString:
 *           type: string
 *         codeDetail:
 *           type: string
 *         dateCreate:
 *           type: string
 *           format: date-time
 *         dateExpired:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           default: AVAILABLE
 *         _customerId:
 *           type: number
 *           default: null
 *         usedTimestamp:
 *           type: string
 *           format: date-time
 *           default: null
 * 
 *   GetShopCodeOutput:
 *     type: object
 *     properties:
 *       available:
 *         type: array
 *         items:
 *           properties:
 *             _id:
 *               type: number
 *             _shopId:
 *               type: number
 *             codeString:
 *               type: string
 *             codeDetail:
 *               type: string
 *             dateCreate:
 *               type: string
 *               format: date-time
 *             dateExpired:
 *               type: string
 *               format: date-time
 *             status:
 *               type: string
 *               default: AVAILABLE
 *             _customerId:
 *               type: number
 *               default: null
 *             usedTimestamp:
 *               type: string
 *               format: date-time
 *               default: null
 *       activated:
 *         type: array
 *         items:
 *           properties:
 *             _id:
 *               type: number
 *             _shopId:
 *               type: number
 *             codeString:
 *               type: string
 *             codeDetail:
 *               type: string
 *             dateCreate:
 *               type: string
 *               format: date-time
 *             dateExpired:
 *               type: string
 *               format: date-time
 *             status:
 *               type: string
 *               default: AVAILABLE
 *             _customerId:
 *               type: number
 *               default: null
 *             usedTimestamp:
 *               type: string
 *               format: date-time
 *               default: null
 * 
 *   GetCustomerCodeOutput:
 *     type: array
 *     items:
 *       properties:
 *         _id:
 *           type: number
 *         _shopId:
 *           type: number
 *         codeString:
 *           type: string
 *         codeDetail:
 *           type: string
 *         dateCreate:
 *           type: string
 *           format: date-time
 *         dateExpired:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           default: CLAIMED
 *         _customerId:
 *           type: number
 *         usedTimestamp:
 *           type: string
 *           format: date-time
 *           default: null
 *
 *   CustomerClaimCodeOutput:
 *     type: object
 *     properties:
 *       _id:
 *         type: number
 *       _shopId:
 *         type: number
 *       codeString:
 *         type: string
 *       codeDetail:
 *         type: string
 *       dateCreate:
 *         type: string
 *         format: date-time
 *       dateExpired:
 *         type: string
 *         format: date-time
 *       status:
 *         type: string
 *         default: CLAIMED
 *       _customerId:
 *         type: number
 *       usedTimestamp:
 *         type: string
 *         format: date-time
 *         default: null
 * 
 *   CustomerActivatedCodeOutput:
 *     type: object
 *     properties:
 *       _id:
 *         type: number
 *       _shopId:
 *         type: number
 *       codeString:
 *         type: string
 *       codeDetail:
 *         type: string
 *       dateCreate:
 *         type: string
 *         format: date-time
 *       dateExpired:
 *         type: string
 *         format: date-time
 *       status:
 *         type: string
 *         default: ACTIVATED
 *       _customerId:
 *         type: number
 *       usedTimestamp:
 *         type: string
 *         format: date-time
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
router.get('/livez', async (req, res) => res.status(200).json(
  {status: 'ok'})
)

/**
 * @swagger
 * paths:
 *   /promo/create:
 *     post: 
 *       summary: create promotions
 *       consume:
 *         - application/json
 *       requestBody:
 *         description: required only _shopId `|` exipredLength(days) default 30 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/CreatePromoInput'
 *       responses:
 *         200:
 *           description: return array of new promotion
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CreatePromoOutput'
 *         400:
 *           description: error
 */
router.post('/promo/create', promotionController.create)

/**
 * @swagger
 * paths:
 *   /promo/getShopCodes:
 *     get:
 *       sumamry: get available codes and activated codes
 *       parameters:
 *         - in: query
 *           name: _shopId
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return 2 array of codes (activated last 20 records)
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/GetShopCodeOutput'
 *         400:
 *           description: error
 *  
 */
router.get('/promo/getShopCodes', promotionController.getShopCodes)

/**
 * @swagger
 * paths:
 *   /promo/getCustomerCodes:
 *     get:
 *       sumamry: get claimed codes of customer
 *       parameters:
 *         - in: query
 *           name: _customerId
 *           type: number
 *           required: true
 *         - in: query
 *           name: _shopId
 *           type: number
 *       responses:
 *         200:
 *           description: return 2 array of codes (activated last 20 records)
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/GetCustomerCodeOutput'
 *         400:
 *           description: error
 */
router.get('/promo/getCustomerCodes', promotionController.getCustomerCodes)

/**
 * @swagger
 * paths:
 *   /promo/customerClaimCode:
 *     put:
 *       summary: customer claims code
 *       parameters:
 *         - in: query
 *           name: _customerId
 *           type: number
 *           required: true
 *       responses:
 *         200:
 *           description: return claimed code randomly
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CustomerClaimCodeOutput'
 *         400:
 *           description: error
 */
router.put('/promo/customerClaimCode', promotionController.customerClaimCode)

/**
 * @swagger
 * paths:
 *   /promo/customerActivatedCode:
 *     put:
 *       summary:
 *       parameters:
 *         - in: query
 *           name: codeString
 *           type: string
 *           required: true
 *       responses:
 *         200:
 *           description: return activated code
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CustomerActivatedCodeOutput'
 *         400:
 *           description: error
 */
router.put('/promo/customerActivatedCode', promotionController.customerActivatedCode)

module.exports = router