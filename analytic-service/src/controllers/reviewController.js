const { default: axios } = require('axios')
const Review = require('../models/review')
const genDate = require('../common/genDate')

const getById = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    res.status(200).json(await Review.findOne(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const get = async (req, res) => {
  try {
    const { _shopId, _customerId } = req.query
    res.status(200).json(await Review.find({
      ...(_shopId && { _shopId: parseInt(_shopId, 10) }),
      ...(_customerId && { _customerId: parseInt(_customerId, 10) }),
    }))
  } catch (error) {
    res.status(400).json(error)
  }
}

const create = async (req, res) => {
  try {
    if (!(req.body._customerId && req.body._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    res.status(200).json(await createReview({ ...req.body, timestamp: new Date()}))
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
    if (!(await Review.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'Review not found'}) 
    }

    // [ ] add field updated at
    res.status(200).json(await Review.findOneAndUpdate(req.query, req.body, { new: true }))

  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const deleteById = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (!(await Review.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'Review not found'}) 
    }

    // [ ] add field updated at
    res.status(200).json(await Review.findOneAndDelete(req.query))

  } catch (error) {
    res.status(400).json(error)
  }
}


// for test
const insertTest = async (req, res) => {
  try {
    const { reviewNumber, _shopId, year } = req.body
    
    const users = await axios.get(`http://auth-node:3002/customer/get`, 
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    if (!users) throw ({ name: 'Error', message: 'No any user in database' })
    
    for (let i = 0; i < reviewNumber; i++) {
      const reviewInput = {
        _shopId,
        _customerId: Math.floor(Math.random() * users.data.length) + 1,
        _menuId: 1,
        flavour: Math.floor(Math.random() * 5) + 1,
        place: Math.floor(Math.random() * 5) + 1,
        service: Math.floor(Math.random() * 5) + 1,
        parking: Math.floor(Math.random() * 5) + 1,
        worthiness: Math.floor(Math.random() * 5) + 1,
        comment: "random comment",
        timestamp: genDate(new Date(parseInt(year, 10), 0, 1), new Date(parseInt(year, 10)+1, 0, 1))
      }

      await createReview(reviewInput)
    }

    res.status(200).json({ status: "ok" })
  } catch (error) {
    res.status(400).json(error)
  }
}

const insertHighReviewTest = async (req, res) => {
  try {
    const { reviewNumber, _shopId, year } = req.body
    
    const users = await axios.get(`http://auth-node:3002/customer/get`, 
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    if (!users) throw ({ name: 'Error', message: 'No any user in database' })
    
    for (let i = 0; i < reviewNumber; i++) {
      const reviewInput = {
        _shopId,
        _customerId: Math.floor(Math.random() * users.data.length) + 1,
        _menuId: 1,
        flavour: Math.floor(Math.random() * 2) + 4,
        place: Math.floor(Math.random() * 2) + 4,
        service: Math.floor(Math.random() * 2) + 4,
        parking: Math.floor(Math.random() * 2) + 4,
        worthiness: Math.floor(Math.random() * 2) + 4,
        comment: "random comment",
        timestamp: genDate(new Date(parseInt(year, 10), 0, 1), new Date(parseInt(year, 10)+1, 0, 1))
      }

      await createReview(reviewInput)
    }

    res.status(200).json({ status: "ok" })
  } catch (error) {
    res.status(400).json(error)
  }
}

const insertLowReviewTest = async (req, res) => {
  try {
    const { reviewNumber, _shopId, year } = req.body
    
    const users = await axios.get(`http://auth-node:3002/customer/get`, 
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    if (!users) throw ({ name: 'Error', message: 'No any user in database' })
    
    for (let i = 0; i < reviewNumber; i++) {
      const reviewInput = {
        _shopId,
        _customerId: Math.floor(Math.random() * users.data.length) + 1,
        _menuId: 1,
        flavour: Math.floor(Math.random() * 2) + 1,
        place: Math.floor(Math.random() * 2) + 1,
        service: Math.floor(Math.random() * 2) + 1,
        parking: Math.floor(Math.random() * 2) + 1,
        worthiness: Math.floor(Math.random() * 2) + 1,
        comment: "random comment",
        timestamp: genDate(new Date(parseInt(year, 10), 0, 1), new Date(parseInt(year, 10)+1, 0, 1))
      }

      await createReview(reviewInput)
    }

    res.status(200).json({ status: "ok" })
  } catch (error) {
    res.status(400).json(error)
  }
}

// function
const createReview = async (body) => {

  const highestReviewId = await Review.findOne({}).sort({_id: -1}).exec();
  let reviewInputs = {
    _id: highestReviewId ? highestReviewId._id + 1 : 1,
    ...body,
  }

  return await Review.create(reviewInputs)
}


module.exports = {
  getById,
  get,
  create,
  update,
  deleteById,
  insertTest,
  insertHighReviewTest,
  insertLowReviewTest
}