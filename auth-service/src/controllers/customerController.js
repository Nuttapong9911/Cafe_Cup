const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Customer = require('../models/customer')
const getRandomInt = require('../common/randomInt')
const { JWT_LOGIN_KEY } = require('../constants/jwt_token')
const { subDistrictList } = require('../constants/shop')

const getById = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    res.status(200).json(await Customer.findOne(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const get = async (req, res) => {
  try {
    res.status(200).json(await Customer.find(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const register = async (req, res) => {
  try {
    res.status(200).json(await createCustomer(req.body))
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!(username && password)) 
      throw ({name: 'ParameterError', message: 'Missing required input'}) 

    let currentUser = await Customer.findOne({username})
    if (currentUser && await bcrypt.compare(password, currentUser.password)){
      const token = jwt.sign(
        { _id: currentUser._id, role: 'customer' },
        JWT_LOGIN_KEY,
        {
          expiresIn: '4h',
        }
      )

      currentUser.password = undefined
      res.status(200).json({ currentUser, token })
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

    const currentUser = await Customer.findOne(req.query)
    const userInputs = req.body

    if (!currentUser) {
      throw ({name: 'ParameterError', message: 'User not found.'}) 
    } 
    if (userInputs.username) {
      const otherUser = await Customer.findOne({username: userInputs.username})
      if (otherUser && currentUser._id !== otherUser._id)
        throw ({name: 'ParameterError', message: 'This username is already used.'}) 
    }

    // [ ] needs authen before do this 
    if (userInputs.password) userInputs.password = await bcrypt.hash(req.body.password, 10)

    let result = await Customer.findOneAndUpdate(req.query, userInputs, {new: true})
    result.password = undefined

    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const deleteByID = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (!(await Customer.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'User not found.'}) 
    }
    res.status(200).json(await Customer.findOneAndDelete(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}


// for test
const randCreateCustomer = async (req, res) => {
  const amount = 10
  try {
    for (let i = 1; i <= amount; i++) {
      let body = {
        username: `user-g1-${i}`,
        password: `password`,
        name: `STUDENT ${i}`,
        gender: getRandomInt(1,2) === 1 ? 'MALE' : 'FEMALE',
        age: 'UNDER_22', 
        occupation: 'Student',
        tags: randomTags(1)
      }
      await createCustomer(body)
    }
    for (let i = 1; i <= amount; i++) {
      let body = {
        username: `user-g2-${i}`,
        password: `password`,
        name: `TOURIST $P{i}`,
        gender: getRandomInt(1,10) <= 2 ? 'MALE' : 'FEMALE',
        age: getRandomInt(1,2) === 1 ? 'UNDER_22' : '23_TO_40',
        tags: randomTags(2)
      }
      await createCustomer(body)
    }
    for (let i = 1; i <= amount; i++) {
      let body = {
        username: `user-g3-${i}`,
        password: `password`,
        name: `OFFICE_WORKIER ${i}`,
        gender: getRandomInt(1,2) === 1 ? 'MALE': 'FEMALE',
        age: getRandomInt(1,10) <= 7 ? '23_TO_40': '41_TO_60',
        tags: randomTags(3)
      }
      await createCustomer(body)
    }
    for (let i = 1; i <= amount; i++) {
      let body = {
        username: `user-g4-${i}`,
        password: `password`,
        name: `TAKEAWAY ${i}`,
        gender: getRandomInt(1,2) === 1 ? 'MALE': 'FEMALE',
        age: getRandomInt(1,10) <= 4 ? '41_TO_60': 'AFTER_61',
        tags: randomTags(4)
      }
      await createCustomer(body)
    }
    res.status(200).json({status: 'ok'})
  } catch (error) {
    res.status(400).json(error)
  }
}

// functions
const createCustomer = async (body) => {
  if (!(body.username && body.password && body.name)) {
    throw ({name: 'ParameterError', message: 'Missing required input'}) 
  }
  if (await Customer.findOne({username: body.username})) {
    throw ({name: 'ParameterError', message: 'This username is already used.'}) 
  }

  const highestUserId = await Customer.findOne({}).sort({_id: -1}).exec();
  let userInputs = {
    _id: highestUserId ? highestUserId._id + 1 : 1,
    ...body,
    password: await bcrypt.hash(body.password, 10),
  }

  let result = await Customer.create(userInputs)
  result.password = undefined

  return result
}

const randomTag = (key, tagArr) =>{
  const rand = getRandomInt(0, tagArr.length)
  return { key, value: tagArr[rand] }
}

const randomTags = (_groupId) => {
  let allTags = [1,2,3,4,5,6]
  let tags = []
  for (let i = 0; i < 3; i++) {
    const randIdx = getRandomInt(0, allTags.length)
    const key = allTags[randIdx]
    switch (_groupId) {
      case 1:
        switch (key) {
          case 1:
            tags.push(randomTag(key, ['สุเทพ', 'แม่เหียะ']))
            break;
          case 2:
            tags.push(randomTag(key, ['CHEAP']))
            break;
          case 3:
            tags.push(randomTag(key, ['EVENING', 'NIGHT']))
            break;
          case 4:
            tags.push(randomTag(key, ['SMALL', 'LARGE']))
            break;
          case 5:
            tags.push(randomTag(key, ['QUITE']))
            break;
          case 6:
            tags.push(randomTag(key, ['STUDENT']))
            break;
        }
        break
      case 2:
        switch (key) {
          case 1:
            tags.push(randomTag(key, ['สุเทพ', 'ช้างม่อย']))
            break;
          case 2:
            tags.push(randomTag(key, ['CHEAP', 'NORMAL', 'HIGH']))
            break;
          case 3:
            tags.push(randomTag(key, ['MORNING', 'AFTERNOON']))
            break;
          case 4:
            tags.push(randomTag(key, ['SMALL', 'LARGE']))
            break;
          case 5:
            tags.push(randomTag(key, ['QUITE', 'NORMAL']))
            break;
          case 6:
            tags.push(randomTag(key, ['TOURIST']))
            break;
        }
        break
      case 3:
        switch (key) {
          case 1:
            tags.push(randomTag(key, ['สุเทพ']))
            break;
          case 2:
            tags.push(randomTag(key, ['NORMAL', 'HIGH']))
            break;
          case 3:
            tags.push(randomTag(key, ['AFTERNOON', 'EVENING']))
            break;
          case 4:
            tags.push(randomTag(key, ['LARGE']))
            break;
          case 5:
            tags.push(randomTag(key, ['NORMAL']))
            break;
          case 6:
            tags.push(randomTag(key, ['OFFICE_WORKER']))
            break;
        }
        break
      case 4:
        switch (key) {
          case 1:
            tags.push(randomTag(key, subDistrictList))
            break;
          case 2:
            tags.push(randomTag(key, ['HIGH']))
            break;
          case 3:
            tags.push(randomTag(key, ['EARLYMORNING', 'MORNING', 'AFTERNOON', 'EVENING']))
            break;
          case 4:
            tags.push(randomTag(key, ['SMALL']))
            break;
          case 5:
            tags.push(randomTag(key, ['QUITE']))
            break;
          case 6:
            tags.push(randomTag(key, ['TAKEAWAY']))
            break;
        }
        break
    }
    
    allTags.splice(randIdx, 1)
  }
  return tags
}

module.exports = {
  getById,
  get,
  register,
  login,
  update,
  deleteByID,
  randCreateCustomer
}