const express = require('express')
const shopController = require('../controllers/shopController')
const customerController = require('../controllers/customerController')
const router = express.Router()

// [ ] task: healthcheck
router.get('/livez', async(req, res) => res.status(200).json({ status: 'ok' }))

router.post('/shop/register', shopController.register)
// [ ] route: /shop/login
router.get('/shop/get', shopController.get)
router.put('/shop/update', shopController.update)
router.delete('/shop/delete', shopController.deleteByID)

router.post('/customer/register', customerController.register)
// [ ] route: /customer/login
router.get('/customer/get', customerController.get)
router.put('/customer/update', customerController.update)
router.delete('/customer/delete', customerController.deleteByID)

// [ ] route: /logout

// for dev
router.post('/shop/inserttest', shopController.insertTest)
router.get('/shop/testScore', shopController.calculateShop)

module.exports = router