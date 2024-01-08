const Review = require('../models/review')

const get = async (req, res) => res.status(200).json(await Review.find(req.body))

const add = async (req, res) => res.status(200).json(await Review.create(req.body))

module.exports = {
  get,
  add
}