const Shop = require('../models/shop')
const Customer = require('../models/customer')

const calculateShop = async (req, res) => {

  try {
    if (!(req.query._id)) {
      throw ({name: 'ParameterError', message: 'Missing required input'}) 
    }
    const targetUser = await Customer.findOne(req.query)
    if(!targetUser) throw ({name: 'ParameterError', message: 'User not found'}) 
    
    // find user group
    const userGroups = await Customer.find({
      gender: targetUser.gender,
      age: targetUser.age,
      occupation: targetUser.occupation
    })
    if (userGroups.length === 0) res.status(200).json([])

    // find all tags and values in the group
    let tagCounts = []
    let tagsArr = []
    userGroups.forEach(user => {
      const tagString1 = `${user.tags[0].key}-${user.tags[0].value}`
      if (tagsArr.indexOf(tagString1) >= 0) {
        tagCounts[tagsArr.indexOf(tagString1)] = tagCounts[tagsArr.indexOf(tagString1)] + 1 
      } else {
        tagsArr.push(tagString1)
        tagCounts.push(1)
      }

      const tagString2 = `${user.tags[1].key}-${user.tags[1].value}`
      if (tagsArr.indexOf(tagString2) >= 0) {
        tagCounts[tagsArr.indexOf(tagString2)] = tagCounts[tagsArr.indexOf(tagString2)] + 1 
      } else {
        tagsArr.push(tagString2)
        tagCounts.push(1)
      }

      const tagString3 = `${user.tags[2].key}-${user.tags[2].value}`
      if (tagsArr.indexOf(tagString3) >= 0) {
        tagCounts[tagsArr.indexOf(tagString3)] = tagCounts[tagsArr.indexOf(tagString3)] + 1 
      } else {
        tagsArr.push(tagString3)
        tagCounts.push(1)
      }
    });

    // find most 1st, 2nd and 3rd frequency tag
    let userGroupTags = []
    const fstIndex = tagCounts.indexOf(Math.max.apply(Math, tagCounts))
    const fstTagString = tagsArr[fstIndex].split('-')
    userGroupTags[0] = { key: parseInt(fstTagString[0]), value: fstTagString[1] }
    tagCounts[fstIndex] = 0

    const sndIndex = tagCounts.indexOf(Math.max.apply(Math, tagCounts))
    const sndTagString = tagsArr[sndIndex].split('-')
    userGroupTags[1] = { key: parseInt(sndTagString[0]), value: sndTagString[1] }
    tagCounts[sndIndex] = 0

    const trdIndex = tagCounts.indexOf(Math.max.apply(Math, tagCounts))
    const trdTagString = tagsArr[trdIndex].split('-')
    userGroupTags[2] = { key: parseInt(trdTagString[0]), value: trdTagString[1] }
    tagCounts[trdIndex] = 0

    // console.log(fstTagObj)
    // console.log(sndTagObj)
    // console.log(trdTagObj)

    // calculate score
    let scores = []
    const shops = await Shop.find()
    for (let i = 0; i < shops.length; i++) {
      const score =  await calculateAllTag(shops[i], targetUser.tags, 0.6) + await calculateAllTag(shops[i], userGroupTags, 0.4)
      scores[i] = { _shopID: shops[i]._id, score }
    }
    scores.sort((a,b) => b.score - a.score)

    res.status(200).json(scores)

  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }

  
}

// calculating functions
const calculateAllTag = async (shop, tagArr, weight) => {
  let total = 0
  // console.log(tagArr)
  if(await calculateTag(shop, tagArr[0])) total = total + (3 * weight)
  // console.log('tag1: ', total)
  if(await calculateTag(shop, tagArr[1])) total = total + (2 * weight)
  // console.log('tag2: ', total)
  if(await calculateTag(shop, tagArr[2])) total = total + (1 * weight)
  // console.log('tag3: ', total)
  return total
}
const calculateTag = async (shop, tag) => {
  switch (tag.key) {
    case 1:
      return tag.value === shop.address.subDistrict

    case 2:
      let meanPrice = 0
      await shop.menus.map((menu) => meanPrice = meanPrice + menu.price)
      meanPrice = meanPrice/shop.menus.length
      if (tag.value === 'CHEAP' && meanPrice > 0 && meanPrice <=50) return true
      else if (tag.value === 'MEDIUM' && meanPrice > 50 && meanPrice <=80) return true
      else if (tag.value === 'HIGH' && meanPrice > 80) return true
      else return false

    case 3:
      const shopOpen = new Date(`2023-01-01 ${shop.timeOpen}`)
      const shopClose = new Date(`2023-01-01 ${shop.timeClose}`)
      // console.log(shop.timeOpen)
      // console.log(shopOpen)
      // console.log(shop.timeClose)
      // console.log(shopClose)
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


module.exports = {
  calculateShop
}