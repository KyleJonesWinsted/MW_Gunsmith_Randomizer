const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Gun = new Schema({
    name: {
        type: String
    },
    imgUrl: {
        type: String
    },
    rankUnlocked: {
        type: Number
    },
    category: {
        type: String
    }
}, {
    collection: 'guns'
})

module.exports = mongoose.model('Gun', Gun)