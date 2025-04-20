const Booking = require('../models/Booking')
const statuses = require('../constants/statuses')

function getBookingById(id) {
  return Booking.findById(id)
}

function getBookingsByRoom(id) {
  return Booking.find({ room: id }).populate('user').populate('room')
}

function getCurrentBookingsByUser(userId) {
  return Booking.find({ user: userId }).populate('user').populate('room')
}

async function addBooking(dataBooking) {
  const booking = await Booking.create(dataBooking)
  return booking.populate([{ path: 'user' }, { path: 'room' }])
}

function deleteBooking(id) {
  return Booking.deleteOne({ _id: id })
}

async function editBooking(id, dataBooking) {
  const newRoomBoooking = await Booking.findByIdAndUpdate(id, dataBooking, {
    returnDocument: 'after'
  })
    .populate('user')
    .populate('room')
  return newRoomBoooking
}

function getRoomBookingsByDateRange(roomId, startDate, endDate) {
  return Booking.find({
    room: roomId,
    status: statuses.BOOKED,
    $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }]
  })
    .populate('user')
    .populate('room')
}

module.exports = {
  addBooking,
  deleteBooking,
  editBooking,
  getBookingById,
  getBookingsByRoom,
  getCurrentBookingsByUser,
  getRoomBookingsByDateRange
}
