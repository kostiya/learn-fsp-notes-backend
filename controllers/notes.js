const noteRouter = require('express').Router()
const Note = require('../models/note')

noteRouter.get('/', async (_request, response) => {
    const notes = await Note.find({})
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

noteRouter.put('/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(request.params.id, { content, important },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

// eslint-disable-next-line no-unused-vars
noteRouter.post('/', async (request, response, next) => {
    const body = request.body

    const note = new Note({
        content : body.content,
        important : body.important || false,
        date : new Date()
    })

    const savedNote = await note.save()
    response.status(201).json(savedNote)
})

module.exports = noteRouter