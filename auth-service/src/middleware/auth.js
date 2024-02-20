const jwt = require('jsonwebtoken')

const { JWT_LOGIN_KEY } = require('../constants/jwt_token')
const Customer = require('../models/customer')
const Shop = require('../models/shop')

module.exports = async (req, res, next) => {
  try {
    // [ ] now we still have one danger hole
    // ถ้า user นำ token ไปยิงใส่ route ของอีก role ด้วย _id เดียวกัน
    // e.g., customer _id 101 นำ token ตัวเอง ไปยิงใส่ route ของ shop ด้วย _id 101 
    // action ของ route นัั้นจะสำเร็จ (ถ้า data ถูกต้อง)

    const { token } = req.headers
    if (!token) throw({name: 'userValidateError', message: 'token not found'})

    
    // [ ] flag skip for dev
    
    if (token === 'skip') return next()

    const decodedToken = jwt.verify(token, JWT_LOGIN_KEY)

    // validate token's fields
    if (!(decodedToken && decodedToken.role && decodedToken._id))
      throw({name: 'userValidateError', message: 'invalid token'})

    const _tokenId = parseInt(decodedToken._id, 10)

    // validate role
    if (decodedToken.role === 'customer' && (await Customer.findOne({ _id: _tokenId }))) {
      return next()
    }  
    else if (decodedToken.role === 'shop' && (await Shop.findOne({ _id: _tokenId }))) {
      return next()
    }
    else
      throw({name: 'userValidateError', message: 'invalid token'})
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}