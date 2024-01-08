const Shop = require('../models/shop')
const bcrypt = require('bcryptjs')
const subDistrictList = [
  'ศรีภูมิ',
  'พระสิงห์',
  'หายยา',
  'ช้างม่อย',
  'ช้างคลาน',
  'วัดเกต',
  'ช้างเผือก',
  'สุเทพ',
  'แม่เหียะ',
  'ป่าแดด',
  'หนองหอย',
  'ท่าศาลา',
  'หนองป่าครั่ง',
  'ฟ้าฮ่าม',
  'ป่าตัน',
  'สันผีเสื้อ',
]

// const getRandomInt = (max) => Math.floor(Math.random() * max) 

const get = async (req,res) => {
  try {
    res.status(200).json(await Shop.find(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const register = async (req, res) => {
  try {
    if (!(req.body.username && req.body.password && req.body.name)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }

    if (await Shop.findOne({username: req.body.username})) {
      throw ({name: 'ParameterError', message: 'This username is already used.'}) 
    }

    const highestUserId = await Shop.findOne({}).sort({_id: -1}).exec();
    let userInputs = {
      _id: highestUserId ? highestUserId._id + 1 : 1,
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    }

    let result = await Shop.create(userInputs)
    result.password = undefined

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

const update = async (req, res) => {
  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    if (!(await Shop.findOne(req.query))) {
      throw ({name: 'ParameterError', message: 'User not found.'}) 
    }
    // RECHECK เคสนี้จะพังถ้า user update username เดิม
    if (req.body.username && await Shop.findOne({username: req.body.username})) {
      throw ({name: 'ParameterError', message: 'This username is already used.'}) 
    }
    // [ ] needs authen befor do this 

    let userInputs = req.body

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

const calculateShop = async (req, res) => {
  let scores = []
  const shops = await Shop.find()
  for (let i = 0; i < shops.length; i++) {
    const score = await calculateAllTag(shops[i], req.body.tagArr, 0.6)
    scores.push({ _id: shops[i]._id,  score })
  }
  res.status(200).json(scores)
}

const randomInsertShop = async (req, res) => {
  const shopNum = 500
  try {
    for (let i = 1; i <= shopNum; i++) {
      await Shop.create({
        _id: i + 1000,
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
        tiemOpen: randTimeOpen(i),
        timeClose: randTimeClose(i),
        noice:  i % 2 === 0 ? 'QUITE' : 'NORMAL',
        singleSeat: i % 5 >= 2 ? 3 : 6,
        doubleSeat: i % 5 >= 2 ? 2 : 4,
        largeSeat: i % 5 >= 2 ? 0 : 4,
        consumerGroup: randConsumerGroup(i)
      })
    }
  } catch (error) {
    console.log(error)
  }
  res.status(200).json({status: 'ok'})
}

// functions
const calculateTag = async (shop, tag) => {
  switch (tag.key) {
    case 1:
      return tag.value === shop.address.subDistrict

    case 2:
      const meanPrice = await shop.menus.reduce((sum, menu) => {
        return sum += menu.price
      })
      if (tag.value === 'CHEAP' && meanPrice > 0 && meanPrice <=50) return true
      else if (tag.value === 'MEDIUM' && meanPrice > 50 && meanPrice <=80) return true
      else if (tag.value === 'HIGH' && meanPrice > 80) return true
      else return false

    case 3:
      const shopOpen = new Date(`2023-01-01 ${shop.tiemOpen}`)
      const shopClose = new Date(`2023-01-01 ${shop.tiemClose}`)
      if (tag.value === 'EARLY MORNING') return shopOpen <= new Date(`2023-01-01 07:00`)
      else if (tag.value === 'MORNING') return shopOpen <= new Date(`2023-01-01 11:00`) && shopClose >= new Date(`2023-01-01 11:00`)
      else if (tag.value === 'AFTERNOON') return shopOpen <= new Date(`2023-01-01 16:00`) && shopClose >= new Date(`2023-01-01 16:00`)
      else if (tag.value === 'EVENING') return shopOpen <= new Date(`2023-01-01 19:00`) && shopClose >= new Date(`2023-01-01 19:00`)
      else if (tag.value === 'NIGHT') return shopClose >= new Date(`2023-01-01 20:00`)
      else return false

    case 4:
      const totalSeat = (1 * shop.singleSeat) + (2 * shop.doubleSeat) + (4 * shop.largeSeat)
      if (tag.value === 'SMALL') return totalSeat <= 10
      else if (tag .value === 'LARGE') return totalSeat > 10
      else return false

    case 5:
      if (tag.value === 'QUITE') return shop.noice === 'QUITE'
      else if (tag.value === 'NORMAL') return shop.noice === 'NORMAL'
      else return false

    case 6:
      if (tag.value === 'STUDENT') return shop.consumerGroup === 'STUDENT'
      else if (tag.value === 'OFFICE_WORKER') return shop.consumerGroup === 'OFFICE_WORKER'
      else if (tag.value === 'TOURIST') return shop.consumerGroup === 'TOURIST'
      else if (tag.value === 'DIGITAL_NORMAD') return shop.consumerGroup === 'DIGITAL_NORMAD'
      else if (tag.value === 'TAKEAWAY') return shop.consumerGroup === 'TAKEAWAY'
      else return false

 
    default:
      return false
  }
}
const calculateAllTag = async (shop, tagArr, weight) => {
  let total = 0
  if(await calculateTag(shop, tagArr[0])) total = total + (3 * weight)
  if(await calculateTag(shop, tagArr[1])) total = total + (2 * weight)
  if(await calculateTag(shop, tagArr[2])) total = total + (1 * weight)
  return total
}

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
  get,
  register,
  update,
  deleteByID,

  randomInsertShop,
  calculateShop
}
