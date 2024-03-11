const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const Shop = require('../models/shop')
const getRandomInt = require('../common/randomInt')
const { subDistrictList, cafeNames, coffeeShopDescriptions, sampleCoverImages } = require('../constants/shop')
const { JWT_LOGIN_KEY } = require('../constants/jwt_token')

const getById = async (req,res) => {
  try {
    res.status(200).json(await Shop.findOne(req.query))
  } catch (error) {
    res.status(400).json(error)
  }
}

const getWithSortByReach = async (req, res) => {
  try {
    let shops = await Shop.find()

    let reaches = await axios.get(`http://analytic-node:3000/reach/getTopReaches`,
      {
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': 'skip'
        }
      }
    )

    let topTenShops = []
    topTenShops = await reaches.data.data.map(reach => {
      for (let i = 0; i < shops.length; i++) {
        if(shops[i]._id === reach._id){
          const shop = {
            ...reach,
            ...shops[i]['_doc']
          }
          return shop
        }
      }
      return {}
    })

    const addReviewDetails = await axios.post(`http://analytic-node:3000/review/getReviewScore`,
      {
        shops: topTenShops,
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': 'skip'
        }
      }
    )

    res.status(200).json({status: 200, data: addReviewDetails.data})
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      message: error.message
    })
  }
}

const get = async (req,res) => {
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
  let { page, pageSize } = req.query;
  
  try {  
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 20;

    const currDate = new Date()
    const formattedTime = currDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok'
    });
    const curTime = parseInt(formattedTime.split(':')[0], 10) * 60 + parseInt(formattedTime.split(':')[1], 10)
    let Result = await Shop.aggregate([
      {
        $addFields: {
          minuteOpen: { $add: [
            { $multiply: [
              { $convert: { input: { $arrayElemAt: [{ $split: ['$timeOpen', ':'] }, 0] }, to: "int", onError: 0, } },
              60
            ]},
            { $convert: { input: { $arrayElemAt: [{ $split: ['$timeOpen', ':'] }, 1] }, to: "int", onError: 0, } },
          ]},
          minuteClose: { $add: [
            { $multiply: [
              { $convert: { input: { $arrayElemAt: [{ $split: ['$timeClose', ':'] }, 0] }, to: "int", onError: 0, } },
              60
            ]},
            { $convert: { input: { $arrayElemAt: [{ $split: ['$timeClose', ':'] }, 1] }, to: "int", onError: 0, } },
          ]},
        }
      },
      {
        $match: 
        {
          ...(name && { name: { $regex: name } }),
          ...(country && { "address.country": { $regex: country } }),
          ...(province && { "address.province": { $regex: province } }),
          ...(district && { "address.district": { $regex: district } }),
          ...(subDistrict && { "address.subDistrict": { $regex: subDistrict } }),
          ...(daysOpen && { daysOpen: { $in: daysOpen } }),
          ...(isAvailable && { minuteOpen: { $lte: curTime } }),
          ...(isAvailable && { minuteClose: { $gte: curTime }}),
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
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ])

    const addReviewDetails = await axios.post(`http://analytic-node:3000/review/getReviewScore`,
      {
        shops: Result[0].data,
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': 'skip'
        }
      }
    )

    res.status(200).json({
      status: 200,
      metadata: {
        totalCount: (Result[0].metadata[0] && Result[0].metadata[0].totalCount) ? Result[0].metadata[0].totalCount : 0,
        page,
        pageSize 
      },
      data: addReviewDetails ? addReviewDetails.data : []
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      message: error.message
    })
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
      const shopName = cafeNames[getRandomInt(0,cafeNames.length)]
      const body = {
        username: `user-g1-rcmd-${i}`,
        password: `password`,
        name: shopName,
        description: coffeeShopDescriptions(shopName),
        address: {
          country: 'ไทย',
          province: 'เชียงใหม่',
          district: 'เมืองเชียงใหม่',
          subDistrict: 'สุเทพ',
        },
        menus: [
          {
          name: 'Espresso',
          category: 'drinks',
          price: 40
          },
          {
            name: 'Latte',
            category: 'drinks',
            price: 45
          },
          {
            name: 'Cappuccino',
            category: 'drinks',
            price: 50
          },
        ],
        coverImage: sampleCoverImages[getRandomInt(0, sampleCoverImages.length)],
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
      const shopName = cafeNames[getRandomInt(0,cafeNames.length)]
      const body = {
        username: `user-g2-rcmd-${i}`,
        password: `password`,
        name: shopName,
        description: coffeeShopDescriptions(shopName),
        address: {
          country: 'ไทย',
          province: 'เชียงใหม่',
          district: 'เมืองเชียงใหม่',
          subDistrict: getRandomInt(1, 2) === 1 ? 'สุเทพ' : 'ช้างม่อย',
        },
        menus: 
        getRandomInt(1,2) === 1 ?
        [
          {
          name: 'Espresso',
          category: 'drinks',
          price: 60
          },
          {
            name: 'Americano',
            category: 'drinks',
            price: 65
          },
          {
            name: 'Flat White',
            category: 'drinks',
            price: 70
          },
        ]
        :
        [
          {
          name: 'Americano',
          category: 'drinks',
          price: 90
          },
          {
            name: 'Mocha',
            category: 'drinks',
            price: 100
          },
          {
            name: 'Cappuccino',
            category: 'drinks',
            price: 110
          },
        ],
        coverImage: sampleCoverImages[getRandomInt(0, sampleCoverImages.length)],
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
      const shopName = cafeNames[getRandomInt(0,cafeNames.length)]
      const body = {
        username: `user-g3-rcmd-${i}`,
        password: `password`,
        name: shopName,
        description: coffeeShopDescriptions(shopName),
        address: {
          country: 'ไทย',
          province: 'เชียงใหม่',
          district: 'เมืองเชียงใหม่',
          subDistrict: getRandomInt(1, 2) === 1 ? 'สุเทพ' : 'แม่เหียะ',
        },
        menus: 
        getRandomInt(1,2) === 1 ?
        [
          {
          name: 'Espresso',
          category: 'drinks',
          price: 60
          },
          {
            name: 'Cappucino',
            category: 'drinks',
            price: 65
          },
          {
            name: 'Latte',
            category: 'drinks',
            price: 70
          },
        ]
        :
        [
          {
          name: 'Americano',
          category: 'drinks',
          price: 90
          },
          {
            name: 'Espresso',
            category: 'drinks',
            price: 100
          },
          {
            name: 'Mocha',
            category: 'drinks',
            price: 110
          },
        ],
        coverImage: sampleCoverImages[getRandomInt(0, sampleCoverImages.length)],
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
      const shopName = cafeNames[getRandomInt(0,cafeNames.length)]
      const body = {
        username: `user-g4-rcmd-${i}`,
        password: `password`,
        name: shopName,
        description: await coffeeShopDescriptions(shopName),
        address: {
          country: 'ไทย',
          province: 'เชียงใหม่',
          district: 'เมืองเชียงใหม่',
          subDistrict: subDistrictList[getRandomInt(0, 16)],
        },
        menus: 
        [
          {
          name: 'Espresso',
          category: 'drinks',
          price: 90
          },
          {
            name: 'Orange Coffee',
            category: 'drinks',
            price: 100
          },
          {
            name: 'Mocha',
            category: 'drinks',
            price: 110
          },
        ],
        coverImage: sampleCoverImages[getRandomInt(0, sampleCoverImages.length)],
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
  getWithSortByReach,
  register,
  login,
  update,
  deleteByID,
  randomInsertShop,
  insertTestForRcmdAlgo
}
