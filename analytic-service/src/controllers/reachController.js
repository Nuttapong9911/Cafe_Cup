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
    const { _shopId, _customerId } = req.query
    res.status(200).json(await Reach.find({
      ...(_shopId && { _shopId: parseInt(_shopId, 10) }),
      ...(_customerId && { _customerId: parseInt(_customerId, 10) }),
    }))
  } catch (error) {
    res.status(400).json(error)
  }
}

const getTopReaches = async (req, res) => {
  try {
    const reaches = await Reach.aggregate([
      {
        $group:
        { 
          _id: "$_shopId",
          count: { $sum: 1 } 
        }
      },
      { $sort: { count: -1 } },
    ]).limit(10)

    res.status(200).json({
      status: 'ok',
      data: reaches
    })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const create = async (req, res) => {
  try {
    if (!(req.body._customerId && req.body._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    // [ ] get user to store age
    const user = await axios.get(`http://auth-node:3002/customer/getById`, { params: {_id: parseInt(req.body._customerId,10)},headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': 'skip' }})
    if (!user) throw ({name: 'ParameterError', message: 'User not found'}) 

    res.status(200).json(await createReach({...req.body, timestamp: new Date(), customerAge: user.data.age}))
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

// for dev
const createRandomReach = async(req, res) => {
  try {
    const { reachNumber, _shopId, year, _customerId } = req.body
    const users = await axios.get(`http://auth-node:3002/customer/get`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
    if (!users) throw ({name: 'Error', message: 'No any user in database'})
    const shops = await axios.post(`http://auth-node:3002/shop/get`, { params: { pageSize: 99999 }, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
    for (let i = 0; i < reachNumber; i++) {
      const _customerIdInput =  _customerId ? parseInt(_customerId, 10) : Math.floor(Math.random() * users.data.length) + 1
      const _shopIdInput = _shopId ? parseInt(_shopId, 10) : Math.floor(Math.random() * shops.data.data.length) + 1
      
      const user = await axios.get(`http://auth-node:3002/customer/getById`,
      {
        params: { _id: _customerIdInput },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': 'skip' },
      })


      if(!user) throw ({name: 'ParameterError', message: 'User not found.'}) 
      
      let reachInput = {
        _shopId: _shopIdInput,
        _customerId: _customerIdInput,
        customerAge: user.data.age,
        timestamp: genDate(new Date(parseInt(year, 10), 0, 1), new Date(parseInt(year, 10)+1, 0, 1))
      }

      await createReach(reachInput)
    }
    res.status(200).json({status: 'ok'})
  } catch (error) {
    console.log(error)
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
  getTopReaches,
  create,
  createRandomReach,
}