const Room = require('../models/Room')
const User = require('../models/User')
const roomsMock = require('../mock/rooms.json')
const usersMock = require('../mock/users.json')
const bcrypt = require('bcrypt')

module.exports = async () => {
  const rooms = await Room.find()
  if (rooms.length !== roomsMock.length) {
    await createInitialEntity(Room, roomsMock)
  }
  const users = await User.find()
  if (users.length !== usersMock.length) {
    const userMockWithHash = await Promise.all(
      usersMock.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        return { ...user, password: hashedPassword }
      })
    )

    await createInitialEntity(User, userMockWithHash)
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
        console.log(e)
        return e
      }
    })
  )
}
