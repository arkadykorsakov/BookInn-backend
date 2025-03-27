const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = function (data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '30d' })
}
