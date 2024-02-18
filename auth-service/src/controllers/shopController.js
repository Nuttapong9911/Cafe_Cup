const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { subDistrictList } = require('../constants/shop')
const Shop = require('../models/shop')
const { JWT_LOGIN_KEY } = require('../constants/jwt_token')


// const getRandomInt = (max) => Math.floor(Math.random() * max) 
const getById = async (req,res) => {
  try {
    res.status(200).json(await Shop.findOne(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const get = async (req,res) => {
  try {
    res.status(200).json(await Shop.find(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const register = async (req, res) => {
  try {
        res.status(200).json(await createShop(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!(username && password)) 
      throw ({name: 'ParameterError', message: 'Missing required input'}) 

    let currentShop = await Shop.findOne({username})
    if (currentShop && await bcrypt.compare(password, currentShop.password)){
      const token = jwt.sign(
        { _id: currentShop._id, role: 'shop' },
        JWT_LOGIN_KEY,
        {
          expiresIn: '4h',
        }
      )

      currentShop.password = undefined
      
      res.status(200).json({ currentShop, token })
    }else {
      throw ({name: 'LoginError', message: 'Invalid Credentials'}) 
    }

  } catch (error) {
    res.status(400).json(error)
  }
}

const update = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    const currentShop = await Shop.findOne(req.query)
    const userInputs = req.body

    if (!currentShop) {
      throw ({name: 'ParameterError', message: 'User not found.'}) 
    }
    if(userInputs.username) {
      const otherUser = await Shop.findOne({username: userInputs.username})
      if (otherUser && currentShop._id !== otherUser._id) {
        throw ({name: 'ParameterError', message: 'This username is already used.'}) 
      }
    }

    // [ ] needs authen befor do this 
    if (userInputs.password) userInputs.password = await bcrypt.hash(req.body.password, 10)

    let result = await Shop.findOneAndUpdate(req.query, userInputs, {new: true})
    result.password = undefined

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

const deleteByID = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (!(await Shop.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'User not found.'}) 
    }
    res.status(200).json(await Shop.findOneAndDelete(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const randomInsertShop = async (req, res) => {
  const shopNum = 500
  try {
    for (let i = 1; i <= shopNum; i++) {
      const body = {
        username: `user${i}`,
        password: `pass${i}`,
        name: `shop ${i}`,
        address: {
          subDistrict: subDistrictList[(i % 16)]
        },
        menus: [{
          price: randPrice(i)
        }],
        daysOpen: randDay(i),
        timeOpen: randTimeOpen(i),
        timeClose: randTimeClose(i),
        noice:  i % 2 === 0 ? 'QUITE' : 'NORMAL',
        singleSeat: i % 5 >= 2 ? 3 : 6,
        doubleSeat: i % 5 >= 2 ? 2 : 4,
        largeSeat: i % 5 >= 2 ? 0 : 4,
        consumerGroup: randConsumerGroup(i)
      }
      await createShop(body)      
    }
    res.status(200).json({status: 'ok'})
  } catch (error) {
    res.status(400).json(error)
  }
}

// functions
const createShop = async (body) => {
  if (!(body.username && body.password && body.name)) {
    throw ({name: 'ParameterError', message: 'Missing required input'}) 
  }

  if (await Shop.findOne({username: body.username})) {
    throw ({name: 'ParameterError', message: 'This username is already used.'}) 
  }

  const highestUserId = await Shop.findOne({}).sort({_id: -1}).exec();
  let userInputs = {
    _id: highestUserId ? highestUserId._id + 1 : 1,
    ...body,
    password: await bcrypt.hash(body.password, 10),
  }

  let result = await Shop.create(userInputs)
  result.password = undefined

  return result
}

// random shop fields functions
const randPrice = (i) => {
  if (i % 10 <= 4) return 45
  else if (i % 10 <= 7) return 60
  else return 90
}
const randDay = (i) => {
  if (i % 5 <= 2) return [1,2,3,4,5]
  else if (i % 5 <= 4) return [0,1,2,3,4,5,6]
  else return [2,3,4,5]
}
const randTimeOpen = (i) => {
  if (i % 10 <= 3) return '06:00'
  else if (i % 10 <= 6) return '12:00'
  else if (i % 10 <= 9) return '19:00'
  else return '00:00'
}
const randTimeClose = (i) => {
  if (i % 10 <= 3) return '11:00'
  else if (i % 10 <= 6) return '17:00'
  else if (i % 10 <= 9) return '23:00'
  else return '23:59'
}
const randConsumerGroup = (i) => {
  if (i % 5 === 1) return 'STUDENT'
  else if (i % 5 === 2) return 'OFFICE_WORKER'
  else if (i % 5 === 3) return 'TOURIST'
  else if (i % 5 === 4) return 'DIGITAL_NORMAD'
  else return 'TAKEAWAY'
}


module.exports = {
  getById,
  get,
  register,
  login,
  update,
  deleteByID,

  randomInsertShop,
}
