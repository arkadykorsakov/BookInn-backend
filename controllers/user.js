const bcrypt = require('bcrypt')
const User = require('../models/User')
const generateToken = require('../helpers/generateToken')

function findUserByEmail(email) {
  return User.findOne({ email })
}

async function register({ email, password }) {
  const candidate = await findUserByEmail(email)
  if (candidate) {
    const error = new Error('User already exists')
    error.status = 409
    throw error
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  return User.create({ email, password: hashedPassword })
}

async function login({ email, password }) {
  const user = await findUserByEmail(email)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    const error = new Error('Wrong password')
    error.status = 400
    throw error
  }

  const token = generateToken({ id: user.id })

  return { user, token }
}

module.exports = {
  findUserByEmail,
  register,
  login
}
