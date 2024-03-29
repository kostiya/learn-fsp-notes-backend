const noteRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

noteRouter.get('/', async (_request, response) => {
    const notes = await Note
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})

// eslint-disable-next-line no-unused-vars
noteRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id)
    if(note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})
// eslint-disable-next-line no-unused-vars
noteRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// eslint-disable-next-line no-unused-vars
noteRouter.put('/:id', async (request, response, next) => {
    const { content, important } = request.body

    const updatedNote = await Note.findByIdAndUpdate(request.params.id,
        {
            content,
            important
        },
        {
            new: true,
            runValidators: true,
            context: 'query'
        })

    response.json(updatedNote)
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }

    return null
}

// eslint-disable-next-line no-unused-vars
noteRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const note = new Note({
        content : body.content,
        important : body.important || false,
        date : new Date(),
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
})

module.exports = noteRouter