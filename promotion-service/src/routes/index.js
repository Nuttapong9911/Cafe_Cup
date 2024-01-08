const express = require('express')
const promotionController = require('../controllers/promotionController')
const router = express.Router()

router.get('/livez', async (req, res) => res.status(200).json(
  {status: 'ok'})
)

router.post('/shop/promo/create', promotionController.create)
router.get('/shop/promo/get', promotionController.get)
router.put('/shop/promo/update', promotionController.update)

module.exports = router