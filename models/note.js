const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    // eslint-disable-next-line no-unused-vars
    .then(_result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content : {
        type: String,
        minlength: 5,
        required: true
    },
    date : {
        type: Date,
        required: true
    },
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)