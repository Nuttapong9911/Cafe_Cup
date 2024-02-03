const Reach = require('../models/reach')
const axios = require('axios')
const genDate = require('../common/genDate')

const getById = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    res.status(200).json(await Reach.findOne(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const get = async (req, res) => {
  try {
    res.status(200).json(await Reach.find(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
}

const create = async (req, res) => {
  try {
    if (!(req.body._customerId && req.body._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    res.status(200).json(await createReach({...req.body, timestamp: new Date()}))
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

// for dev
const createRandomReach = async(req, res) => {
  try {
    const num = req.body.reachNumber
    const users = await axios.get(`http://auth-node:3002/customer/get`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
    if (!users) throw ({name: 'Error', message: 'No any user in database'})
    for (let i = 0; i < num; i++) {
      const _customerId =  Math.floor(Math.random() * users.data.length) + 1

      const user = await axios.get(`http://auth-node:3002/customer/getById`,
      {
        params: { _id: _customerId },
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      if(!user) throw ({name: 'ParameterError', message: 'User not found.'}) 
      
      let reachInput = {
        _shopId: req.body._shopId,
        _customerId: Math.floor(Math.random() * users.data.length) + 1,
        customerAge: user.data.age,
        timestamp: genDate(new Date(2020, 1, 1), new Date())
      }

      await createReach(reachInput)
    }
    res.status(200).json({status: 'ok'})
  } catch (error) {
    res.status(400).json(error)
  }
}

// function
const createReach = async (body) => {
  const highestReachId = await Reach.findOne({}).sort({_id: -1}).exec();
  let reachInputs = {
    _id: highestReachId ? highestReachId._id + 1 : 1,
    ...body,
  }

  return await Reach.create(reachInputs)
}

module.exports = {
  getById,
  get,
  create,
  createRandomReach,
}