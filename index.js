const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./modules/person')


app.use(express.json())
/* Universal allowance at the moment */
app.use(cors())

/* To host the frontend using build file created with npm */
app.use(express.static('build'))


/* Explicit implementation of morgan with logging of
    body of a POST request */
app.use(morgan(function (tokens, req, res) {
  const person = req.body
  const info = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (([tokens.method(req, res)][0] === 'POST')) {
    const postinfo = info.concat(JSON.stringify(person))
    return postinfo.join(' ')
  }
  return info.join(' ')
})
)

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  /*
      const validated = new Person({
        name: person.name,
        number: person.number
      })
      //validated.validate().catch(error => next(error))

       Must give normal Javascript object, not Person object */
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error =>  next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body
  const personDB = new Person({
    name: person.name,
    number: person.number
  })
  personDB.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    res.json(person)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      }
      res.status(500).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)

  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.get('/info', (req, res) => {
  Person.find({}).then(result => {
    res.send(
      `Phonebook has info for ${result.length} people`
            + '<br><br/>' + `${Date()}`
    )
  })
})

const unknownEndpoint = (request, response) => {
  console.log('Unknown endpoint')
  response.status(404).end()
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    console.log('Malformatted id')
    return response.status(400).end()
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

/* Using port defined in env variable, and if not available, then 3001 */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})