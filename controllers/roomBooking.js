const RoomBooking = require('../models/RoomBooking')
const statuses = require('../constants/statuses')

function getRoomBookingById(id) {
  return RoomBooking.findById(id)
}

function getRoomBookingsByRoomId(id) {
  return RoomBooking.find({ room: id })
}

function getCurrentBookingsForUser(userId) {
  const today = new Date()

  return RoomBooking.find({
    user: userId,
    startDate: { $lte: today },
    endDate: { $gte: today },
    status: statuses.BOOKED
  })
}

function addRoomBooking(roomBooking) {
  return RoomBooking.create(roomBooking)
}

function deleteRoomBooking(id) {
  return RoomBooking.deleteOne({ _id: id })
}

async function editRoomBooking(id, roomBooking) {
  const newRoomBoooking = await RoomBooking.findByIdAndUpdate(id, roomBooking, {
    returnDocument: 'after'
  })
  return newRoomBoooking
}

module.exports = {
  addRoomBooking,
  deleteRoomBooking,
  editRoomBooking,
  getRoomBookingById,
  getRoomBookingsByRoomId,
  getCurrentBookingsForUser
}
