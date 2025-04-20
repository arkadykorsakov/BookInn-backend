const mongoose = require('mongoose')
const statuses = require('../constants/statuses')

const BookingSchema = mongoose.Schema(
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

const Booking = mongoose.model('Booking', BookingSchema)

module.exports = Booking
