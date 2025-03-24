const Room = require('../models/Room')
const RoomBooking = require('../models/RoomBooking')
const statuses = require('../constants/statuses')

async function getRooms() {
  const rooms = await Room.find()
  const today = new Date()

  return await Promise.all(
    rooms.map(async (room) => {
      const roomBooking = await RoomBooking.findOne({
        room: room._id,
        status: statuses.BOOKED,
        startDate: { $lte: today },
        endDate: { $gte: today }
      })

      return {
        id: room._id,
        ...room.toObject(),
        isBooked: !!roomBooking
      }
    })
  )
}
async function getFreeRooms() {
  const roomsWithStatus = await getRooms()
  return roomsWithStatus.filter((room) => !room.isBooked)
}

async function getRoomById(id) {
  return Room.findById(id)
}

module.exports = {
  getRooms,
  getRoomById,
  getFreeRooms
}
