const express = require('express')
const {
  getRooms,
  getRoomById,
  getFreeRooms
} = require('../controllers/room.controller')
const {
  addRoomBooking,
  deleteRoomBooking,
  editRoomBooking,
  getRoomBookingById,
  getRoomBookingsByRoomId,
  getCurrentBookingsForUser
} = require('../controllers/roomBooking.controller')
const mapRoom = require('../helpers/mapRoom')
const mapRoomBooking = require('../helpers/mapRoomBooking')
const statuses = require('../constants/statuses')

const router = express.Router({ mergeParams: true })

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await getRooms()
    res.status(200).json({
      error: null,
      data: {
        rooms: (rooms || []).map(mapRoom)
      }
    })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
})
router.get('/rooms/free', async (req, res) => {
  try {
    const rooms = await getFreeRooms()
    res.status(200).json({
      error: null,
      data: {
        rooms: (rooms || []).map(mapRoom)
      }
    })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
})
router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await getRoomById(req.params.id)
    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }
    res.status(200).json({
      error: null,
      data: {
        room: mapRoom(room)
      }
    })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
})
router.get('/room-bookings/current-user', async (req, res) => {
  try {
    const roomBookings = await getCurrentBookingsForUser(
      '67dffc70cd100cdad5a282ec'
    )
    res.status(200).json({
      error: null,
      data: {
        roomsBookings: (roomBookings || []).map(mapRoomBooking)
      }
    })
    res.json
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})
router.get('/room-bookings/:roomId', async (req, res) => {
  try {
    const roomBookings = await getRoomBookingsByRoomId(req.params.roomId)
    res.status(200).json({
      error: null,
      data: {
        roomBookings: (roomBookings || []).map(mapRoomBooking)
      }
    })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
})

router.post('/auth/register', (req, res) => {
  res.status(201).json({ message: 'Зарегистрирован' })
})
router.post('/auth/login', (req, res) => {
  res.status(200).json({ message: 'Вход' })
})
router.post('/auth/logout', (req, res) => {
  res.status(200).json({ message: 'Выход' })
})
router.post('/room-bookings/:roomId', async (req, res) => {
  try {
    const { startDate, endDate } = req.body
    const { roomId } = req.params

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: 'startDate and endDate are required' })
    }

    const room = await getRoomById(roomId)
    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }

    const newRoomBooking = await addRoomBooking({
      user: '67dffc70cd100cdad5a282ec',
      room: roomId,
      startDate,
      endDate
    })

    res.status(201).json({
      error: null,
      data: {
        roomBooking: mapRoomBooking(newRoomBooking)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

router.patch('/room-bookings/:id/status', async (req, res) => {
  try {
    const updatedRoomBooking = await editRoomBooking(req.params.id, {
      status: req.body.status
    })

    if (!updatedRoomBooking) {
      return res.status(404).json({ error: 'Room booking not found' })
    }

    res.json({
      error: null,
      data: {
        roomBooking: mapRoomBooking(updatedRoomBooking)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})
router.patch('/room-bookings/:id', async (req, res) => {
  try {
    const { startDate, endDate } = req.body

    if (!startDate && !endDate) {
      return res
        .status(400)
        .json({ error: 'At least one of startDate or endDate is required' })
    }

    const currentBooking = await getRoomBookingById(req.params.id)
    if (!currentBooking) {
      return res.status(404).json({ error: 'Room booking not found' })
    }

    if (currentBooking.status === statuses.BOOKED) {
      return res
        .status(403)
        .json({ error: 'Cannot update booking with status BOOKED' })
    }

    const updateData = {}
    if (startDate) updateData.startDate = startDate
    if (endDate) updateData.endDate = endDate

    const updatedRoomBooking = await editRoomBooking(req.params.id, updateData)

    res.json({
      error: null,
      data: {
        roomBooking: mapRoomBooking(updatedRoomBooking)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})
router.patch('/room-bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await getRoomBookingById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Room booking not found' })
    }

    const updatedBooking = await editRoomBooking(req.params.id, {
      status: statuses.CANCELLED
    })

    res.json({
      error: null,
      data: {
        roomBooking: mapRoomBooking(updatedBooking)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

router.delete('/room-bookings/:id', async (req, res) => {
  try {
    const booking = await getRoomBookingById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Room booking not found' })
    }

    if (booking.status === statuses.BOOKED) {
      return res
        .status(403)
        .json({ error: 'Cannot delete a booking with status BOOKED' })
    }

    await deleteRoomBooking(req.params.id)

    res.status(200).json({ error: null })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

module.exports = router
