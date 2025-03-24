module.exports = function (room) {
  return {
    id: room.id,
    imageUrl: room.image,
    isBooked: room.isBooked
  }
}
