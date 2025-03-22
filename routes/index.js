const express = require('express')

const router = express.Router({ mergeParams: true })

router.get('/rooms', (req, res) => {
  res.status(200).json({ messege: 'Все номера' })
})
router.get('/rooms/free', (req, res) => {
  res.status(200).json({ messege: 'Свободные номера' })
})
router.get('/rooms/:id', (req, res) => {
  res.status(200).json({ messege: `Номер ${req.params.id}` })
})
router.get('/me/rooms', (req, res) => {
  res.status(200).json({ messege: 'Забронированные клиентом номера' })
})
router.get('/room-bookings/:roomId', (req, res) => {
  res.status(200).json({ messege: `Все брони номера ${req.params.roomId}` })
})

module.exports = router
