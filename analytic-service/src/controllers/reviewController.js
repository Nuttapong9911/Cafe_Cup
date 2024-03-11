const axios = require('axios')
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

    // review gain +1 point
    await axios.put(`http://auth-node:3002/customer/editReviewPoints`,
      {},
      { 
        params: { _id: parseInt(req.body._customerId, 10), points: 1 },
        headers: { 'token': 'skip' }
      },
    )
    
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

// get shops
// return shops added fields reviewsNum and reviewScoreMean
const getReviewScore = async (req, res) => {
  try {
    const { shops } = req.body
    if (!shops) throw({name: 'ParameterError', message: 'Shops not found'}) 
    if (shops.length === 0) res.status(200).json([])
    else {
      const reviews = await Review.aggregate([
        {
          $group:
          {
            _id: '$_shopId',
            avgFlavour: { $avg: '$flavour' },
            avgPlace: { $avg: '$place' },
            avgService: { $avg: '$service' },
            avgParking: { $avg: '$parking' },
            avgWorthiness: { $avg: '$worthiness' },
            totalReview: { $sum: 1 }
          },
        },
        {
          $addFields:
          { avgTotalScore: { $divide: 
              [ { $add:
                  ['$avgFlavour',
                  '$avgPlace',
                  '$avgService',
                  '$avgParking',
                  '$avgWorthiness'
                  ]
                },
                5
              ]
            }
          }
        },
      ])
  
      const shopsWithReview = await shops.map(shop => {
        for (let i = 0; i < reviews.length; i++) {
          if(reviews[i]._id == shop._id || reviews[i]._id == shop._shopID ){
            const data = {
              ...shop,
              reviewNum: reviews[i].totalReview,
              reviewScoreMean: reviews[i].avgTotalScore
            }
            return data
          }
        }
        const data = {
          ...shop,
          reviewNum: 0,
          reviewScoreMean: 0
        }
        return data
      })
  
      res.status(200).json(shopsWithReview)
    }
  } catch (error) {
    console.log(error)
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
    const shops = await axios.post(`http://auth-node:3002/shop/get`, { params: { pageSize: 99999 }, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})

    for (let i = 0; i < reviewNumber; i++) {
      const _shopIdInput = _shopId ? parseInt(_shopId, 10) : Math.floor(Math.random() * shops.data.data.length) + 1
      
      const reviewInput = {
        _shopId: _shopIdInput,
        _customerId: Math.floor(Math.random() * users.data.length) + 1,
        menuName: 'menu 1',
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
    console.log(error)
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
        menuName: 'menu 1',
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
        menuName: 'menu 1',
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
  getReviewScore,
  insertTest,
  insertHighReviewTest,
  insertLowReviewTest
}