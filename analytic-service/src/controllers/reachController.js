const Reach = require('../models/reach')
const axios = require('axios')

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

    res.status(200).json(await createReach(req.body))
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

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
    // console.log(shopId)
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

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getReachAgePerHours = async (req, res) => {
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

    const users = await axios.get(`http://auth-node:3002/customer/get`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    console.log(users)
    const result = await Reach.aggregate([
      { 
        $project: 
          {
            _shopId: 1, 
            timestamp: 1,
            _customerId: 1, 
            'year': { $year: '$timestamp' },
            'month' : { $month: '$timestamp' },
            'day': { $dayOfMonth: '$timestamp'},
            'dayOfWeek': { $dayOfWeek: '$timestamp'},
          }
      },
      // {
      //   $unwind: '$age'
      // },
      { 
        $match: 
          {
            _shopId: parseInt(_shopId),
            ...(year && { year }),
            month: { $in: inputMonth },
            ...(dayOfWeek && { dayOfWeek }),
          }
      }
      ,
      // {
      //   $group: 
      //     {
      //       _id: "$age",
      //       count: { $sum: 1 }
      //     }
      // },
      // { $sort: { _id: 1 } }
    ])
  
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

// for dev
const createRandomReach = async(req, res) => {
  try {
    const num = req.body.reachNumber
    for (let i = 0; i < num; i++) {
      const body = {
        _shopId: req.body._shopId,
        _customerId: Math.floor(Math.random() * 100) + 1
      }
      const highestReachId = await Reach.findOne({}).sort({_id: -1}).exec();
      let reachInputs = {
        _id: highestReachId ? highestReachId._id + 1 : 1,
        ...body,
        timestamp: genDate(new Date(2020, 1, 1), new Date())
      }

      await Reach.create(reachInputs)
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
    timestamp: new Date()
  }

  return await Reach.create(reachInputs)
}

const genDate = (from, to) => new Date(
  from.getTime() + Math.random() * (to.getTime() - from.getTime()),
)

module.exports = {
  getById,
  get,
  create,
  getReachCountPerHours,
  getReachAgePerHours,
  createRandomReach,
  
}