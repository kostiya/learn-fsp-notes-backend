const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        importent: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const userLogin = async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'rooty', passwordHash })

    const returnedUser = await user.save()
    return jwt.sign({ username: 'root', id: returnedUser._id }, process.env.SECRET)
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb,
    userLogin
}