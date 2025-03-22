const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cookieParser());
app.use(express.json());

mongoose.connect(MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}/`)
    })
}).catch(err => console.log(err));