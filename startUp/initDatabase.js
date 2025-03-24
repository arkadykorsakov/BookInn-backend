const Room = require('../models/Room')
const User = require('../models/User')
const roomMock = require('../mock/rooms.json')
const userMock = require('../mock/users.json')

module.exports = async () => {
  const rooms = await Room.find()
  if (rooms.length !== roomMock.length) {
    await createInitialEntity(Room, roomMock)
  }
  const users = await User.find()
  if (users.length !== userMock.length) {
    await createInitialEntity(User, userMock)
  }
}

async function createInitialEntity(Model, data) {
  await Model.collection.drop()
  return Promise.all(
    data.map(async (item) => {
      try {
        const newItem = new Model(item)
        await newItem.save()
        return newItem
      } catch (e) {
        return e
      }
    })
  )
}
