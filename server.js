const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const router = express.Router()
const PORT = process.env.PORT || 4000
const dbUri = process.env.PROD_MONGODB || 'mongodb://localhost:27017/gunsmith'

let Gun = require('./gun.model')
let Attachment = require('./attachment.model')

mongoose.connect(dbUri, {
    useNewUrlParser: true
})
const connection = mongoose.connection
connection.once('open', function() {
    console.log('MongoDB connection established at: ' + dbUri)
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(router)
app.use(express.static(path.join(__dirname, 'client/build')));

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
    try {
        Attachment.find({gunId: req.params.gunId, rankUnlocked: {$lte: req.params.gunRank}}, (err, attachments) => {
            const attachmentsCount = attachments.length
            if (!attachments || attachmentsCount === 0) {
                console.log('Error: ' + err)
                res.status(404).send('No matching attachments found\nError: ' + err)
                return
            }
            var returnedAttachments = []
            const numberOfAttachmentsToReturn = 5
            for (let i = 0; i < numberOfAttachmentsToReturn; i++) {
                const randomIndex = Math.round(Math.random() * (attachmentsCount - 1))
                const randomAttachment = attachments[randomIndex]
                if (checkAttachmentValidity(returnedAttachments, randomAttachment)) {
                    returnedAttachments.push(randomAttachment)
                }
            }
            res.json(returnedAttachments)
        })
    } catch(error) {
        res.sendStatus(500)
    }
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

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

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

/* Remove before production
router.route('/add/gun').post((req, res) => {
    const newGun = new Gun(req.body)
    console.log(req.body)
    newGun.save()
        .then(gun => {
            res.status(200).json({
                'newGun': newGun
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send('Error saving new gun. ' + error)
        })
})

//Remove before production
router.route('/add/attachment').post((req, res) => {
    const newAttachment = new Attachment(req.body)
    console.log(newAttachment.name)
    newAttachment.save()
        .then(attachment => {
            res.status(200).json({
                'newAttachment': newAttachment
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send('Error saving new attachment. ' + error)
        })
})*/
