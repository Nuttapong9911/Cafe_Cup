const Customer = require('../models/customer')

const get = async (req, res) => res.status(200).json(await Customer.find(req.body))

const register = async (req, res) => res.status(200).json(await Customer.create(req.body))

const update = async (req, res) => res.status(200).json(
  await Customer.findOneAndUpdate({_id: req.body._id}, req.body)
)

const deleteByID = async (req, res) => res.status(200).json(
  await Customer.findOneAndDelete(req.body)
)

module.exports = {
  get,
  register,
  update,
  deleteByID
}