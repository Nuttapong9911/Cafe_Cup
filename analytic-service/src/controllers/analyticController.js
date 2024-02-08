const axios = require('axios')

const Reach = require('../models/reach')
const Review = require('../models/review')

const validateToken = async (token) => {
  let validatedResult
  try {
    validatedResult = await axios.get(`http://auth-node:3002/validateToken`,
    {
      headers:
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': token
      }
    }
  )
  } catch (error) {
    throw ({name: 'ValidateError', message: 'Token Validation Failed'}) 
  }
  if (!validatedResult && validatedResult.status !== 200 && validatedResult.data.status !== 'ok') {
    throw ({name: 'ValidateError', message: 'Token Validation Failed'}) 
  }
}

const getReachCountPerHours = async (req, res) => {
  try {
    await validateToken(req.headers.token)
  
    if (!(req.query._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    const { year, month, quarter, dayOfWeek } = req.body
    const { _shopId } = req.query
    let inputMonth
    if (quarter) {
      inputMonth = [ quarter*3 - 2, quarter*3 - 1, quarter*3 ]
    } else if (month) {
      inputMonth = [ month ]
    } else {
      inputMonth = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    }
   
    const result = await Reach.aggregate([
      { $project: {
          _shopId: 1,
          timestamp: 1, 
          'year': { $year: '$timestamp' },
          'month' : { $month: '$timestamp' },
          'day': { $dayOfMonth: '$timestamp'},
          'dayOfWeek': { $dayOfWeek: '$timestamp'},
          'hour': { $hour: '$timestamp'}
        }
      },
      { $match: {
          _shopId: parseInt(_shopId),
          ...(year && { year }),
          month: {
            $in: inputMonth
          },
          ...(dayOfWeek && { dayOfWeek }),
      }},
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    let total = 0
    result.map((item) => {
      total += item.count
    })

    res.status(200).json({result, total})
  } catch (error) {
    res.status(400).json(error)
  }
}

const getReachAge = async (req, res) => {
  try {
    await validateToken(req.headers.token)

    if (!(req.query._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    const { year, month, quarter, dayOfWeek } = req.body
    const { _shopId } = req.query
    let inputMonth
    if (quarter) {
      inputMonth = [ quarter*3 - 2, quarter*3 - 1, quarter*3 ]
    } else if (month) {
      inputMonth = [ month ]
    } else {
      inputMonth = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    }

    const result = await Reach.aggregate([
      { 
        $project: 
          {
            _shopId: 1, 
            timestamp: 1,
            _customerId: 1, 
            customerAge: 1,
            'year': { $year: '$timestamp' },
            'month' : { $month: '$timestamp' },
            'day': { $dayOfMonth: '$timestamp'},
            'dayOfWeek': { $dayOfWeek: '$timestamp'},
          }
      },
      { 
        $match: 
          {
            _shopId: parseInt(_shopId),
            ...(year && { year }),
            month: { $in: inputMonth },
            ...(dayOfWeek && { dayOfWeek }),
          }
      },
      {
        $group: 
          {
            _id: "$customerAge",
            count: { $sum: 1 }
          }
      },
      { $sort: { _id: 1 } }
    ])

    let total = 0
    result.map(item => {
      total += item.count
    })
  
    res.status(200).json({result, total})
  } catch (error) {
    res.status(400).json(error)
  }
}

const getReviewScore = async (req, res) => {
  try {
    await validateToken(req.headers.token)

    if (!(req.query._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    
    const { year, month, quarter, dayOfWeek } = req.body
    const { _shopId } = req.query
    let inputMonth
    if (quarter) {
      inputMonth = [ quarter*3 - 2, quarter*3 - 1, quarter*3 ]
    } else if (month) {
      inputMonth = [ month ]
    } else {
      inputMonth = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    }

    const result = await Review.aggregate([
      { $project: {
          _shopId: 1,
          timestamp: 1, 
          'year': { $year: '$timestamp' },
          'month' : { $month: '$timestamp' },
          'day': { $dayOfMonth: '$timestamp'},
          'dayOfWeek': { $dayOfWeek: '$timestamp'},
          'flavour': 1,
          'place': 1,
          'service': 1,
          'parking': 1,
          'worthiness': 1,
        }
      },
      { $match: {
          _shopId: parseInt(_shopId),
          ...(year && { year }),
          month: {
            $in: inputMonth
          },
          ...(dayOfWeek && { dayOfWeek }),
      }},
      {
        $group: {
          _id: null,
          totalFlavour: { $avg: '$flavour' },
          totalPlace: { $avg: '$place' },
          totalService: { $avg: '$service' },
          totalparking: { $avg: '$parking' },
          totalWorthiness: { $avg: '$worthiness' },
          count: { $sum: 1 }
        }
      }
    ])

    res.status(200).json(result[0])
  } catch (error) {
    res.status(400).json(error)
  }
}

const getRevieweRank = async (req, res) => {
  try {
    await validateToken(req.headers.token)

    if (!(req.query._shopId)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    
    const { year, month, quarter } = req.body
    const { _shopId } = req.query
    let inputMonth
    if (quarter) {
      inputMonth = [ quarter*3 - 2, quarter*3 - 1, quarter*3 ]
    } else if (month) {
      inputMonth = [ month ]
    } else {
      inputMonth = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    }

    const result = await Review.aggregate([
      {
        $project: 
        {
          _shopId: 1,
          timestamp: 1, 
          'year': { $year: '$timestamp' },
          'month' : { $month: '$timestamp' },
          'day': { $dayOfMonth: '$timestamp'},
          'flavour': 1,
          'place': 1,
          'service': 1,
          'parking': 1,
          'worthiness': 1,
        }
      },
      {
        $match: 
        {
          ...(year && { year }),
          month: { $in: inputMonth },
        }
      },
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
        {
          avgTotalScore:
          {
            $divide: 
            [
              {
                $add: ['$avgFlavour', '$avgPlace', '$avgService', '$avgParking', '$avgWorthiness']  
              },
              5
            ]
          }
        }
      },
      {
        $facet: 
        {
          'thisShop':
          [
            {
              $match: { _id: parseInt(_shopId) }
            }
          ],
          'allShop':
          [
            {
              $group:
              {
                _id: null,
                flavourAvg: { $avg: '$avgFlavour' },
                flavourMin: { $min: '$avgFlavour' },
                flavourMax: { $max: '$avgFlavour' },
                
                placeAvg: { $avg: '$avgPlace' },
                placeMin: { $min: '$avgPlace' },
                placeMax: { $max: '$avgPlace' },

                serviceAvg: { $avg: '$avgService' },
                serviceMin: { $min: '$avgService' },
                serviceMax: { $max: '$avgService' },

                parkingAvg: { $avg: '$avgParking' },
                parkingMin: { $min: '$avgParking' },
                parkingMax: { $max: '$avgParking' },

                worthinessAvg: { $avg: '$avgWorthiness' },
                worthinessMin: { $min: '$avgWorthiness' },
                worthinessMax: { $max: '$avgWorthiness' },

                totalScoreAvg: { $avg: '$avgTotalScore' },
                totalScoreMin: { $min: '$avgTotalScore' },
                totalScoreMax: { $max: '$avgTotalScore' },

                overallTotalReviews: { $sum: '$totalReview' }
              }
            }
          ]
        }
      },
    ])

    const formatResult = {
      flavour: {
        avg: result[0].allShop[0].flavourAvg,
        min: result[0].allShop[0].flavourMin,
        max: result[0].allShop[0].flavourMax,
        shopAvg: result[0].thisShop[0].avgFlavour
      },
      place: {
        avg: result[0].allShop[0].placeAvg,
        min: result[0].allShop[0].placeMin,
        max: result[0].allShop[0].placeMax,
        shopAvg: result[0].thisShop[0].avgPlace
      },
      service: {
        avg: result[0].allShop[0].serviceAvg,
        min: result[0].allShop[0].serviceMin,
        max: result[0].allShop[0].serviceMax,
        shopAvg: result[0].thisShop[0].avgService
      },
      parking: {
        avg: result[0].allShop[0].parkingAvg,
        min: result[0].allShop[0].parkingMin,
        max: result[0].allShop[0].parkingMax,
        shopAvg: result[0].thisShop[0].avgParking
      },
      worthiness: {
        avg: result[0].allShop[0].worthinessAvg,
        min: result[0].allShop[0].worthinessMin,
        max: result[0].allShop[0].worthinessMax,
        shopAvg: result[0].thisShop[0].avgWorthiness
      },
      totalScore: {
        avg: result[0].allShop[0].totalScoreAvg,
        min: result[0].allShop[0].totalScoreMin,
        max: result[0].allShop[0].totalScoreMax,
        shopAvg: result[0].thisShop[0].avgTotalScore
      },
      thisShopReviewNumber: result[0].thisShop[0].totalReview,
      allShopreviewNumber: result[0].allShop[0].overallTotalReviews
    }

    res.status(200).json(formatResult)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

module.exports = {
  getReachCountPerHours,
  getReachAge,
  getReviewScore,
  getRevieweRank
}