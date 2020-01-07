const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

let Attachment = new Schema({
    name: {
        type: String
    },
    gunId: {
        type: ObjectId
    },
    rankUnlocked: {
        type: Number
    },
    imgUrl: {
        type: String
    },
    slot: {
        type: String
    }
}, {
    collection: 'attachments'
})

module.exports = mongoose.model('Attachment', Attachment)