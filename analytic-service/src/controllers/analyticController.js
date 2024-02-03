const Reach = require('../models/reach')
const Review = require('../models/review')

const getReachCountPerHours = async (req, res) => {
  try {
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
      },
      { $sort: { _id: 1 } }
    ])

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getRevieweRank = async (req, res) => {
  try {
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
                overallAvgFlavour: { $avg: '$avgFlavour' },
                minAvgFlavour: { $min: '$avgFlavour' },
                maxAvgFlavour: { $max: '$avgFlavour' },
                
                overallAvgPlace: { $avg: '$avgPlace' },
                minAvgPlace: { $min: '$avgPlace' },
                maxAvgPlace: { $max: '$avgPlace' },

                overallAvgService: { $avg: '$avgService' },
                minAvgService: { $min: '$avgService' },
                maxAvgService: { $max: '$avgService' },

                overallAvgParking: { $avg: '$avgParking' },
                minAvgParking: { $min: '$avgParking' },
                maxAvgParking: { $max: '$avgParking' },

                overallAvgWorthiness: { $avg: '$avgWorthiness' },
                minAvgWorthiness: { $min: '$avgWorthiness' },
                maxAvgWorthiness: { $max: '$avgWorthiness' },

                overallAvgTotalScore: { $avg: '$avgTotalScore' },
                minAvgTotalScore: { $min: '$avgTotalScore' },
                maxAvgTotalScore: { $max: '$avgTotalScore' },

                overallTotalReviews: { $sum: '$totalReview' }
   
              }
            }
          ]
        }
      },
    ])   

    res.status(200).json(result)
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