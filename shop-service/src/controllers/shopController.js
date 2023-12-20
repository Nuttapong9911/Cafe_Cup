const mongoose = require('mongoose')
const Shop = require('../models/shop')

const getAllShop = async (req,res) => res.status(200).json(await Shop.find())

const insertShop = async (req, res) => {
  const result = await Shop.create(req.body)

  res.status(200).json(result)
}

module.exports = {
  getAllShop,
  insertShop
}
