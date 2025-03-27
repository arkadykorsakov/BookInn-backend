const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cookieParser = require('cookie-parser')
const initDatabase = require('./startUp/initDatabase')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

app.use(cookieParser())
app.use(express.json())

app.use('/api', routes)

async function start() {
  try {
    //  mongoose.connection.once('open', () => {
    //    initDatabase()
    //  })
    await mongoose.connect(MONGO_URI)
    app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

start()
