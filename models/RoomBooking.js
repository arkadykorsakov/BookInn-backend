const mongoose = require('mongoose')
const statuses = require('../constants/statuses')

const RoomBookingSchema = mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: Number,
      default: statuses.PENDING
    }
  },
  {
    timestamps: true
  }
)

const RoomBooking = mongoose.model('RoomBooking', RoomBookingSchema)

module.exports = RoomBooking
