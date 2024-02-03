module.exports = (from, to) => {
  return new Date(
    from.getTime() + Math.random() * (to.getTime() - from.getTime()),
  )
}