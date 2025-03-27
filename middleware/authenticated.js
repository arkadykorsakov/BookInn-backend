const { verifyToken } = require('../helpers/tokens')
const User = require('../models/User')

module.exports = async function (req, res, next) {
  const tokenData = verifyToken(req.cookies.token)
  const user = await User.findOne({ _id: tokenData.id })

  if (!user) {
    res.status(401).json({
      message: 'Unauthorized'
    })
    return
  }

  req.user = {
    email: user.email,
    id: user._id,
    role: user.role
  }

  next()
}
