const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()
const PORT = 4000

let Gun = require('./gun.model')
let Attachment = require('./attachment.model')

mongoose.connect('mongodb://localhost:27017/gunsmith', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const connection = mongoose.connection
connection.once('open', function() {
    console.log('MongoDB connection established')
})

app.use(cors())
app.use(bodyParser.json())
app.use(router)

router.route('/gun/:id').get((req, res) => {
    Gun.findById(req.params.id, (err, gun) => {
        if (!gun) {
            console.log(err)
            res.status(404).send('Invalid Id' + err)
        } else {
            res.json(gun)
        }
    })
})

//Get random gun unlocked for a given player rank
router.route('/gun/random/:rank').get((req, res) => {
    Gun.find({rankUnlocked: {$lte: req.params.rank}}, (err, guns) => {
        if (!guns) {
            console.log(err)
            res.status(404).send('Unable to get guns. Error: ' + err)
        } else {
            const randomIndex = Math.round(Math.random() * (guns.length - 1))
            res.json(guns[randomIndex])
        }
    })
})

// Get between 1 and 5 random attachments for a gun of a given rank
router.route('/attachments/:gunId/:gunRank').get((req, res) => {
    Attachment.find({gunId: req.params.gunId, rankUnlocked: {$lte: req.params.gunRank}}, (err, attachments) => {
        const attachmentsCount = attachments.length
        if (!attachments || attachmentsCount === 0) {
            console.log('Error: ' + err)
            res.status(404).send('No matching attachments found\nError: ' + err)
            return
        }
        var returnedAttachments = []
        const numberOfAttachmentsToReturn = Math.ceil(Math.random() * 5)
        for (let i = 0; i < numberOfAttachmentsToReturn; i++) {
            const randomIndex = Math.round(Math.random() * (attachmentsCount - 1))
            const randomAttachment = attachments[randomIndex]
            if (checkAttachmentValidity(returnedAttachments, randomAttachment)) {
                returnedAttachments.push(randomAttachment)
            }
        }
        res.json(returnedAttachments)
    })
})

router.route('/guns/:category').get((req, res) => {
    Gun.find({category: req.params.category}, (err, guns) => {
        if (!guns) {
            console.log(err)
            res.status(404).send('No guns found. Error:' + err)
        } else {
            res.json(guns)
        }
    })
})

function checkAttachmentValidity(attachmentArray, newAttachment) {
    for (let j = 0; j < attachmentArray.length; j++) {
        const attachment = attachmentArray[j]
        if (newAttachment.slot === attachment.slot || 
            newAttachment._id === attachment._id) {
            return false
        }
    }
    return true
}


app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})
