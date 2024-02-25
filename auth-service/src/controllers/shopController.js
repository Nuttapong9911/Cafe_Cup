const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Shop = require('../models/shop')
const getRandomInt = require('../common/randomInt')
const { subDistrictList } = require('../constants/shop')
const { JWT_LOGIN_KEY } = require('../constants/jwt_token')

const getById = async (req,res) => {
  try {
    res.status(200).json(await Shop.findOne(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const get = async (req,res) => {
  try {
    const { 
      name,
      country,
      province,
      district,
      subDistrict,
      daysOpen,
      singleSeat,
      doubleSeat,
      largeSeat,
      wifi,
      powerPlugs,
      conferenceRoom,
      toilet,
      smokingZone,
      photoSpots,
      noice,
      customerGroup,
      isAvailable
    } = req.body
    let Result = await Shop.aggregate([
      {
        $match: 
        {
          ...(name && { name: { $regex: name } }),
          ...(country && { "address.country": { $regex: country } }),
          ...(province && { "address.province": { $regex: province } }),
          ...(district && { "address.district": { $regex: district } }),
          ...(subDistrict && { "address.subDistrict": { $regex: subDistrict } }),
          ...(daysOpen && { daysOpen: { $in: daysOpen } }),
          ...(singleSeat && { singleSeat: { $ne: 0 } }),
          ...(doubleSeat && { doubleSeat: { $ne: 0 } }),
          ...(largeSeat && { largeSeat: { $ne: 0 } }),
          ...(wifi && { wifi: !!wifi }),
          ...(powerPlugs && { powerPlugs: !!powerPlugs }),
          ...(conferenceRoom && { conferenceRoom: !!conferenceRoom }),
          ...(toilet && { toilet: !!toilet }),
          ...(smokingZone && { smokingZone: !!smokingZone }),
          ...(photoSpots && { photoSpots: { $regex: photoSpots } }),
          ...(noice && { noice: { $regex: noice } }),
          ...(customerGroup && { customerGroup: { $regex: customerGroup } }),
        }
      },
    ])

    if (isAvailable) {
      let available = Result.filter(shop => {
        const open = new Date()
        open.setHours(shop.timeOpen.split(':')[0])
        open.setMinutes(shop.timeOpen.split(':')[1])
        
        const close = new Date()
        close.setHours(shop.timeClose.split(':')[0])
        close.setMinutes(shop.timeClose.split(':')[1])

        const now = new Date()
        return open <= now && now <= close
      })
      res.status(200).json(available)
    }else res.status(200).json(Result)
  } catch (error) {
    console.log(error)
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
  const shopNum = 510
  try {
    for (let i = 501; i <= shopNum; i++) {
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
        singleSeat: i % 5 >= 2 ? 3 : 6,
        doubleSeat: i % 5 >= 2 ? 2 : 4,
        largeSeat: i % 5 >= 2 ? 0 : 4,
        wifi:  i % 2 === 0,
        powerPlugs:  i % 2 === 0,
        conferenceRoom:  i % 2 === 0,
        toilet: i % 2 === 0,
        smokingZone:  i % 2 === 0,
        photoSpots: randPhotoSpots(i),
        noice:  i % 2 === 0 ? 'QUITE' : 'NORMAL',
        customerGroup: randCustomerGroup(i)
      }
      await createShop(body)      
    }
    res.status(200).json({status: 'ok'})
  } catch (error) {
    res.status(400).json(error)
  }
}

const insertTestForRcmdAlgo = async (req, res) => {
  try {
    // shop group STUDENT
    for (let i = 1; i <= 20; i++) {
      const body = {
        username: `user-g1-rcmd-${i}`,
        password: `password`,
        name: `shop-for-STUDENT-${i}`,
        address: {
          subDistrict: 'สุเทพ'
        },
        menus: [
          {
          name: 'menu 1',
          category: 'drinks',
          price: 40
          },
          {
            name: 'menu 2',
            category: 'drinks',
            price: 45
          },
          {
            name: 'menu 3',
            category: 'drinks',
            price: 50
          },
        ],
        daysOpen: randDay(i),
        timeOpen: '08:00',
        timeClose: getRandomInt(1, 2) === 1 ? '19:00': '20:30',
        singleSeat: getRandomInt(1, 10) <= 3 ? 10 : 11,
        doubleSeat: 0,
        largeSeat: 0,
        wifi: true,
        powerPlugs:  true,
        conferenceRoom:  true,
        toilet: true,
        smokingZone: false,
        photoSpots: randPhotoSpots(i),
        noice: 'QUITE',
        customerGroup: 'STUDENT'
      }
      await createShop(body)      
    }

    // shop group TOURISTS
    for (let i = 1; i <= 20; i++) {
      const body = {
        username: `user-g2-rcmd-${i}`,
        password: `password`,
        name: `shop-for-TOURISTS-${i}`,
        address: {
          subDistrict: getRandomInt(1, 2) === 1 ? 'สุเทพ' : 'ช้างม่อย',
        },
        menus: 
        getRandomInt(1,2) === 1 ?
        [
          {
          name: 'menu 1',
          category: 'drinks',
          price: 60
          },
          {
            name: 'menu 2',
            category: 'drinks',
            price: 65
          },
          {
            name: 'menu 3',
            category: 'drinks',
            price: 70
          },
        ]
        :
        [
          {
          name: 'menu 1',
          category: 'drinks',
          price: 90
          },
          {
            name: 'menu 2',
            category: 'drinks',
            price: 100
          },
          {
            name: 'menu 3',
            category: 'drinks',
            price: 110
          },
        ],
        daysOpen: randDay(i),
        timeOpen: getRandomInt(1, 2) === 1 ? '08:00': '13:00',
        timeClose: '19:00',
        singleSeat: getRandomInt(1, 10) <= 3 ? 10 : 11,
        doubleSeat: 0,
        largeSeat: 0,
        wifi: true,
        powerPlugs:  false,
        conferenceRoom:  false,
        toilet: true,
        smokingZone: false,
        photoSpots: randPhotoSpots(i),
        noice: getRandomInt(1, 2) === 1 ? 'QUITE' : 'NORMAL',
        customerGroup: 'TOURIST'
      }
      await createShop(body)      
    }

    // shop group OFFICE
    for (let i = 1; i <= 20; i++) {
      const body = {
        username: `user-g3-rcmd-${i}`,
        password: `password`,
        name: `shop-for-OFFICE-${i}`,
        address: {
          subDistrict: getRandomInt(1, 2) === 1 ? 'สุเทพ' : 'แม่เหียะ',
        },
        menus: 
        getRandomInt(1,2) === 1 ?
        [
          {
          name: 'menu 1',
          category: 'drinks',
          price: 60
          },
          {
            name: 'menu 2',
            category: 'drinks',
            price: 65
          },
          {
            name: 'menu 3',
            category: 'drinks',
            price: 70
          },
        ]
        :
        [
          {
          name: 'menu 1',
          category: 'drinks',
          price: 90
          },
          {
            name: 'menu 2',
            category: 'drinks',
            price: 100
          },
          {
            name: 'menu 3',
            category: 'drinks',
            price: 110
          },
        ],
        daysOpen: randDay(i),
        timeOpen: '08:00',
        timeClose: '19:00',
        singleSeat: 12,
        doubleSeat: 0,
        largeSeat: 0,
        wifi: true,
        powerPlugs:  true,
        conferenceRoom:  true,
        toilet: true,
        smokingZone: true,
        photoSpots: randPhotoSpots(i),
        noice: 'NORMAL',
        customerGroup: 'OFFICE_WORKER'
      }
      await createShop(body)      
    }

    // shop group SECRET_SHOP
    for (let i = 1; i <= 20; i++) {
      const body = {
        username: `user-g4-rcmd-${i}`,
        password: `password`,
        name: `shop-for-SECRET_SHOP-${i}`,
        address: {
          subDistrict: subDistrictList[getRandomInt(0, 16)],
        },
        menus: 
        [
          {
          name: 'menu 1',
          category: 'drinks',
          price: 90
          },
          {
            name: 'menu 2',
            category: 'drinks',
            price: 100
          },
          {
            name: 'menu 3',
            category: 'drinks',
            price: 110
          },
        ],
        daysOpen: randDay(i),
        timeOpen: '05:00',
        timeClose: '18:00',
        singleSeat: 7,
        doubleSeat: 0,
        largeSeat: 0,
        wifi: false,
        powerPlugs:  false,
        conferenceRoom:  false,
        toilet: false,
        smokingZone: false,
        photoSpots: randPhotoSpots(i),
        noice: 'QUITE',
        customerGroup: 'TAKEAWAY'
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
const randCustomerGroup = (i) => {
  if (i % 5 === 1) return 'STUDENT'
  else if (i % 5 === 2) return 'OFFICE_WORKER'
  else if (i % 5 === 3) return 'TOURIST'
  else if (i % 5 === 4) return 'DIGITAL_NORMAD'
  else return 'TAKEAWAY'
}
const randPhotoSpots = (i) => {
  if (i % 3 === 0) return 'FEW'
  else if (i % 3 === 1) return 'MEDIUM'
  else return 'MUCH'
}


module.exports = {
  getById,
  get,
  register,
  login,
  update,
  deleteByID,

  randomInsertShop,
  insertTestForRcmdAlgo
}
