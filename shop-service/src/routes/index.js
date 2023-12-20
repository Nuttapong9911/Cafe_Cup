const express = require('express')
const shopController = require('../controllers/shopController')
const router = express.Router()

// [ ] healthcheck
router.get('/livez', async(req, res) => res.status(200).json({ status: 'ok' }))

router.get('/shop/getAll', shopController.getAllShop)
router.put('/shop/insertShop', shopController.insertShop)

module.exports = router