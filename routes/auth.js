const express = require('express')
const mapUser = require('../helpers/mapUser')
const authenticated = require('../middlewares/authenticated')
const { register, login } = require('../controllers/user')

const router = express.Router({ mergeParams: true })

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await register({ email, password })
    res.status(201).json({ user: mapUser(user), error: null })
  } catch (e) {
    const statusCode = e.status || 500
    res.status(statusCode).json({ error: e.message || 'Internal Server Error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { user, token } = await login({ email, password })

    res.cookie('token', token, {
      httpOnly: true
    })

    res.status(200).json({ user: mapUser(user), error: null })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message || 'Internal Server Error' })
  }
})

router.post('/logout', authenticated, (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true
    })
    res.status(200).json({ error: null })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
})

module.exports = router
