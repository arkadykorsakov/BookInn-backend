const express = require('express')

const router = express.Router({ mergeParams: true })

router.get('/rooms', (req, res) => {})
router.get('/rooms/free', (req, res) => {})
router.get('/rooms/:id', (req, res) => {})
router.get('/me/rooms', (req, res) => {})
router.get('/room-bookings/:id', (req, res) => {})

router.post('/auth/register', (req, res) => {})
router.post('/auth/login', (req, res) => {})
router.post('/room-bookings/:id', (req, res) => {})

router.put('/room-bookings/:id ', (req, res) => {})
router.patch('/room-bookings/:id/status', (req, res) => {})

router.delete('/room-bookings/:id ', (req, res) => {})

module.exports = router
