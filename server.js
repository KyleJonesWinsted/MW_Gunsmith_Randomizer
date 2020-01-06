const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())
app.use(router)

router.route('/').get((req, res) => {
    res.status(200).send('Hello World')
})

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})
