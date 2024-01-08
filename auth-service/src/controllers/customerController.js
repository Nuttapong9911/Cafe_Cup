const Customer = require('../models/customer')
const bcrypt = require('bcryptjs')

const get = async (req, res) => {
  try {
    res.status(200).json(await Customer.find(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const register = async (req, res) => {
  try {
    if (!(req.body.username && req.body.password && req.body.name)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (await Customer.findOne({username: req.body.username})) {
      throw ({name: 'ParameterError', message: 'This username is already used.'}) 
    }

    const highestUserId = await Customer.findOne({}).sort({_id: -1}).exec();
    let userInputs = {
      _id: highestUserId ? highestUserId._id + 1 : 1,
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    }

    let result = await Customer.create(userInputs)
    result.password = undefined
    
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const update = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (!(await Customer.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'This username is already used.'}) 
    }
    // RECHECK เคสนี้จะพังถ้า user update username เดิม
    if (req.body.username && await Customer.findOne({username: req.body.username})) {
      throw ({name: 'ParameterError', message: 'This username is already used.'}) 
    }
    // [ ] needs authen befor do this 

    let userInputs = req.body
    if (userInputs.password) userInputs.password = await bcrypt.hash(req.body.password, 10)

    let result = await Customer.findOneAndUpdate(req.query, userInputs, {new: true})
    result.password = undefined

    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const deleteByID = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (!(await Customer.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'User not found.'}) 
    }
    res.status(200).json(await Customer.findOneAndDelete(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = {
  get,
  register,
  update,
  deleteByID
}