const express = require('express')
const { getRooms, getRoomById, getEmptyRooms } = require('../controllers/room')
const authenticated = require('../middlewares/authenticated')
const mapRoom = require('../helpers/mapRoom')

const router = express.Router({ mergeParams: true })

router.get('/', authenticated, async (req, res) => {
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

router.get('/empty', authenticated, async (req, res) => {
  try {
    const rooms = await getEmptyRooms()
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

router.get('/:id', authenticated, async (req, res) => {
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

module.exports = router
