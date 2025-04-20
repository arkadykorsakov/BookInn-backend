const mapUser = require('./mapUser')
const mapRoom = require('./mapRoom')

module.exports = function (booking) {
  return {
    id: booking.id,
    user: mapUser(booking.user),
    room: mapRoom(booking.room),
    status: booking.status,
    startDate: booking.startDate,
    endDate: booking.endDate
  }
}
