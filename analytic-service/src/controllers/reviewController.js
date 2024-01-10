const Review = require('../models/review')

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
    res.status(200).json(await Review.find(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
}

const create = async (req, res) => {
  try {
    if (!(req.body._customerId && req.body._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
  
    const highestReviewId = await Review.findOne({}).sort({_id: -1}).exec();
    let reviewInputs = {
      _id: highestReviewId ? highestReviewId._id + 1 : 1,
      ...req.body,
      timestamp: new Date()
    }

    res.status(200).json(await Review.create(reviewInputs))
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

module.exports = {
  getById,
  get,
  create,
  update,
  deleteById
}