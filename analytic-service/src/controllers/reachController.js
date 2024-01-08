const Reach = require('../models/reach')

const get = async (req, res) => res.status(200).json(await Reach.find(req.body))

const add = async (req, res) => res.status(200).json(await Reach.create(req.body))

module.exports = {
  get,
  add
}