const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  generateToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '30d' })
  },
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}
