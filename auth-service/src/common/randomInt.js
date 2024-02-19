/**
 * random int fucntion
 * @param {*} start min
 * @param {*} range range of random start from start param
 * @returns a random integer
 */
const getRandomInt = (start , range) => {
  return Math.floor(Math.random() * range) + start
}

module.exports = getRandomInt