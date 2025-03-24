module.exports = function (roomBooking) {
  return {
    id: roomBooking.id,
    userId: roomBooking.user,
    roomId: roomBooking.room,
    status: roomBooking.status,
    startDate: roomBooking.startDate,
    endDate: roomBooking.endDate
  }
}
