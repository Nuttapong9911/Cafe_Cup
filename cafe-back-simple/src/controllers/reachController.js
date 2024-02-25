// const mongoose = require('mongoose')
const Reach = require('../models/reach')

const getAllReach = async (req, res) => {
  res.status(200).json(await Reach.find())
}

const getReachCountPerHours = async (req, res) => {
  const { year, month, quarter, dayOfWeek } = req.body
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
        _userID:1, 
        timeStamp:1, 
        'year': { $year: '$timeStamp' },
        'month' : { $month: '$timeStamp' },
        'day': { $dayOfMonth: '$timeStamp'},
        'dayOfWeek': { $dayOfWeek: '$timeStamp'},
        'hour': { $hour: '$timeStamp'}
      }
    },
    { $match: {
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
}

const getReachAgePerHours = async (req, res) => {
  const { year, month, quarter, dayOfWeek } = req.body
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
      $lookup: 
        {
          from: 'users',
          localField: '_userID',
          foreignField: '_userID',
          as: 'users'
        }
    },
    { 
      $project: 
        {
          _userID: 1, 
          timeStamp: 1, 
          'year': { $year: '$timeStamp' },
          'month' : { $month: '$timeStamp' },
          'day': { $dayOfMonth: '$timeStamp'},
          'dayOfWeek': { $dayOfWeek: '$timeStamp'},
          'age': '$users.age'
        }
    },
    {
      $unwind: '$age'
    },
    { 
      $match: 
        {
          ...(year && { year }),
          month: { $in: inputMonth },
          ...(dayOfWeek && { dayOfWeek }),
        }
    }
    ,
    {
      $group: 
        {
          _id: "$age",
          count: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } }
  ])

  res.status(200).json(result)
}

const genDate = (from, to) => new Date(
    from.getTime() + Math.random() * (to.getTime() - from.getTime()),
)

const insertOne = async (req, res) => {
  const { year, month, day, userID } = req.body
  console.log(`userID: ${userID}, y: ${year}, m: ${month}, d:${day}`)

  const result = await Reach.create({
    _userID: userID,
    timeStamp: new Date(year, month, day)
  })
  
  res.status(200).json(result)
}

const insertMany = async (req, res) => {
  for (let index = 0; index < 50; index++) {
    await Reach.create({
      _userID: Math.floor(Math.random() * 10 + 1),
      timeStamp: genDate(new Date(2022, 0, 1), new Date())
    })
  }

  res.status(200).json({ status: 'ok' })
}

module.exports = {
  getReachCountPerHours,
  getReachAgePerHours,
  getAllReach,
  insertOne,
  insertMany
}