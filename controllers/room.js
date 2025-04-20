const Room = require('../models/Room')
const RoomBooking = require('../models/Booking')
const statuses = require('../constants/statuses')

async function getRooms() {
  const rooms = await Room.find().lean()
  const today = new Date()

  const roomBookings = await RoomBooking.find({
    room: { $in: rooms.map((room) => room._id) },
    status: statuses.BOOKED,
    startDate: { $lte: today },
    endDate: { $gte: today }
  }).select('room')

  const bookedRoomsSet = new Set(
    roomBookings.map((booking) => booking.room.toString())
  )

  return rooms.map((room) => ({
    id: room._id,
    ...room,
    isBooked: bookedRoomsSet.has(room._id.toString())
  }))
}

async function getEmptyRooms() {
  const roomsWithStatus = await getRooms()
  return roomsWithStatus.filter((room) => !room.isBooked)
}

async function getRoomById(id) {
  return Room.findById(id)
}

module.exports = {
  getRooms,
  getRoomById,
  getEmptyRooms
}
