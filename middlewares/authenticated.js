const { verifyToken } = require('../helpers/tokens')
const User = require('../models/User')

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const tokenData = verifyToken(req.cookies.token)

  const user = await User.findOne({ _id: tokenData.id })

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.user = {
    email: user.email,
    id: user.id,
    role: user.role
  }

  next()
}
