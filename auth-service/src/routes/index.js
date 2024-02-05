const express = require('express')

const shopController = require('../controllers/shopController')
const customerController = require('../controllers/customerController')
const recommendController = require('../controllers/recommendController')
const middlewareAuth = require('../middleware/auth')

const router = express.Router()

// [ ] task: healthcheck
router.get('/livez', async(req, res) => res.status(200).json({ status: 'ok' }))

router.post('/shop/register', shopController.register)
router.post('/shop/login', shopController.login)
router.get('/shop/getById', middlewareAuth, shopController.getById)
router.get('/shop/get', shopController.get)
router.put('/shop/update', middlewareAuth, shopController.update)
router.delete('/shop/delete', shopController.deleteByID)

router.post('/customer/register', customerController.register)
router.post('/customer/login', customerController.login)
router.get('/customer/getById', middlewareAuth, customerController.getById)
router.get('/customer/get', customerController.get)
router.put('/customer/update', middlewareAuth, customerController.update)
router.delete('/customer/delete', customerController.deleteByID)

// [ ] route: /logout
router.get('/customer/recommend', middlewareAuth, recommendController.calculateShop)

// for dev
router.post('/shop/inserttest', shopController.randomInsertShop)
router.post('/customer/inserttest', customerController.randCreateCustomer)



module.exports = router