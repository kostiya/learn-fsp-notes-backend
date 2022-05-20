require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path: ' , request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))


let notes = [
    {
        id: 1, content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
]

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const generateID = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId + 1
}

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body
    let note = notes.find(note => note.id === id)
    if(!note){
        response.statusMessage = "Resourse not exist"
        response.status(404).end()
    }
    if(!body.content){
        return response.status(400).json({
            error: 'content is missing'
        })
    }
    note.content = body.content,
    note.important = body.important || false
    note.date = new Date()

    response.json(note)
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(body.content === undefined){
        return response.status(400).json({
            error: 'content is missing'
        })
    }
    const note = new Note({
        content : body.content,
        important : body.important || false,
        date : new Date()
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
