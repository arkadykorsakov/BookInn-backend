const mongoose = require('mongoose')
const validator = require('validator')
const roles = require('../constants/roles')

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Invalid email'
      }
    },
    password: {
      type: String,
      required: true,
      min: 4
    },
    role: {
      type: Number,
      default: roles.USER
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', UserSchema)

module.exports = User
