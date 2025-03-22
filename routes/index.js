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

router.post('/auth/register', (req, res) => {
  res.status(201).json({ messege: 'Зарегистрирован' })
})
router.post('/auth/login', (req, res) => {
  res.status(200).json({ messege: 'Вход' })
})
router.post('/auth/logout', (req, res) => {
  res.status(200).json({ messege: 'Выход' })
})
router.post('/room-bookings/:roomId', (req, res) => {
  res.status(200).json({
    messege: `Бронирование номера ${req.params.roomId}`
  })
})

router.patch('/room-bookings/:id/status', (req, res) => {
  res.status(200).json({
    messege: `Изменение статуса бронирования ${req.params.id}`
  })
})
router.put('/room-bookings/:id', (req, res) => {
  res.status(200).json({
    messege: `Изменение в бронировании ${req.params.id}`
  })
})

router.delete('/room-bookings/:id', (req, res) => {
  res.status(200).json({
    message: `Удаление бронирования ${req.params.id}`
  })
})

module.exports = router
