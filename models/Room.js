const mongoose = require('mongoose')
const validator = require('validator')

const RoomSchema = mongoose.Schema(
  {
    image: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: 'Image should be a valid url'
      }
    }
  },
  {
    timestamps: true
  }
)

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room
