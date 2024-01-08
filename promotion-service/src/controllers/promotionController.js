const Promotion = require('../models/promotion')

const create = async (req, res) => res.status(200).json(await Promotion.create(req.body))

const get = async (req, res) => res.status(200).json(await Promotion.find(req.body))

const update = async (req, res) => res.status(200).json(
  await Promotion.findOneAndUpdate({_id: req.body._id}, req.body)
)

module.exports = {
  create,
  get,
  update
}