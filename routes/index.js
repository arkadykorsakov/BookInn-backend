const express = require('express')

const router = express.Router({ mergeParams: true })

router.get('/rooms', (req, res) => {})
router.get('/rooms/free', (req, res) => {})
router.get('/rooms/:id', (req, res) => {})
router.get('/me/rooms', (req, res) => {})
router.get('/room-bookings/:id', (req, res) => {})
