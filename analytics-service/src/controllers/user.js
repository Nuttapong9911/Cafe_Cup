const User = require('../models/user')

const getAllUser = async (req, res) => res.status(200).json(await User.find()) 

const insertOneUser = async (req, res) => {
  const { _userId, username, gender, age, occupation } = req.body

  // [ ] case duplicate userID

  const result = await User.create({ _userId, username, gender, age, occupation })

  res.status(200).json(result)
}

module.exports = {
  getAllUser,
  insertOneUser
}