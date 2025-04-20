const express = require('express')
const authenticated = require('../middlewares/authenticated')
const hasRole = require('../middlewares/hasRole')
const roles = require('../constants/roles')
const statuses = require('../constants/statuses')
const { getRoomById } = require('../controllers/room')
const {
  getCurrentBookingsByUser,
  getBookingsByRoom,
  getRoomBookingsByDateRange,
  addBooking,
  editBooking,
  getBookingById,
  deleteBooking
} = require('../controllers/booking')
const mapBooking = require('../helpers/mapBooking')

const router = express.Router({ mergeParams: true })

router.get('/me', authenticated, hasRole([roles.USER]), async (req, res) => {
  try {
    const bookings = await getCurrentBookingsByUser(req.user.id)
    res.status(200).json({
      error: null,
      data: {
        bookings: (bookings || []).map(mapBooking)
      }
    })
    res.json
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

router.get('/:roomId', async (req, res) => {
  try {
    const bookings = await getBookingsByRoom(req.params.roomId)
    res.status(200).json({
      error: null,
      data: {
        bookings: (bookings || []).map(mapBooking)
      }
    })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
})

router.post(
  '/:roomId',
  authenticated,
  hasRole([roles.USER]),
  async (req, res) => {
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

      const existingBookings = await getRoomBookingsByDateRange(
        roomId,
        startDate,
        endDate
      )

      if (existingBookings.length) {
        return res
          .status(400)
          .json({ error: 'Room is already booked for the selected dates' })
      }

      const newBooking = await addBooking({
        user: req.user.id,
        room: roomId,
        startDate,
        endDate
      })

      res.status(201).json({
        error: null,
        data: {
          booking: mapBooking(newBooking)
        }
      })
    } catch (err) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
)

router.patch(
  '/:id/status',
  authenticated,
  hasRole([roles.ADMIN]),
  async (req, res) => {
    try {
      const updatedBooking = await editBooking(req.params.id, {
        status: req.body.status
      })

      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      res.json({
        error: null,
        data: {
          booking: mapBooking(updatedBooking)
        }
      })
    } catch (err) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
)

router.patch('/:id', authenticated, hasRole([roles.USER]), async (req, res) => {
  try {
    const { startDate, endDate } = req.body

    if (!startDate && !endDate) {
      return res
        .status(400)
        .json({ error: 'At least one of startDate or endDate is required' })
    }

    const currentBooking = await getBookingById(req.params.id)
    if (!currentBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (currentBooking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forrbidden' })
    }

    if (currentBooking.status === statuses.BOOKED) {
      return res
        .status(403)
        .json({ error: 'Cannot update booking with status BOOKED' })
    }

    const existingBookings = await getRoomBookingsByDateRange(
      currentBooking.room,
      startDate || currentBooking.startDate,
      endDate || currentBooking.endDate
    )

    if (
      existingBookings.filter(
        (booking) => booking.user.toString() !== currentBooking.room.toString()
      ).length
    ) {
      return res
        .status(400)
        .json({ error: 'Room is already booked for the selected dates' })
    }

    const updateData = {}
    if (startDate) updateData.startDate = startDate
    if (endDate) updateData.endDate = endDate

    const updatedBooking = await editBooking(req.params.id, updateData)

    res.json({
      error: null,
      data: {
        booking: mapBooking(updatedBooking)
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

router.patch(
  '/:id/cancel',
  authenticated,
  hasRole([roles.USER]),
  async (req, res) => {
    try {
      const booking = await getBookingById(req.params.id)
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forrbidden' })
      }

      const updatedBooking = await editBooking(req.params.id, {
        status: statuses.CANCELLED
      })

      res.json({
        error: null,
        data: {
          booking: mapBooking(updatedBooking)
        }
      })
    } catch (err) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
)

router.delete(
  '/:id',
  authenticated,
  hasRole([roles.USER]),
  async (req, res) => {
    try {
      const booking = await getBookingById(req.params.id)
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forrbidden' })
      }

      if (booking.status === statuses.BOOKED) {
        return res
          .status(403)
          .json({ error: 'Cannot delete a booking with status BOOKED' })
      }

      await deleteBooking(req.params.id)

      res.status(200).json({ error: null })
    } catch (err) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
)

module.exports = router
