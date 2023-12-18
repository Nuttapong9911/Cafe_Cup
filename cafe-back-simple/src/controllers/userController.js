const User = require('../models/user')

const getAllUser = async (req, res) => res.status(200).json(await User.find())

const insertUser = async (req, res) => {
  const { _userID, username, gender, age } = req.body
  const result = await User.create({ _userID, username, gender, age })

  res.status(200).json(result)
}

module.exports = {
  getAllUser,
  insertUser
}