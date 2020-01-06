const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()
const PORT = 4000

let Gun = require('./gun.model')
let Attachment = require('./attachment.model')

mongoose.connect('mongodb://localhost:27017/gunsmith')
const connection = mongoose.connection
connection.once('open', function() {
    console.log('MongoDB connection established')
})

app.use(cors())
app.use(bodyParser.json())
app.use(router)

router.route('/').get((req, res) => {
    res.status(200).send('Hello World')
})

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})
