const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path');
const cors = require('cors')

    let persons = [
      {
        name: "Julius Caesar",
        number: "23429382-253235",
        id: 1
      },
      {
        name: "Trajanus",
        number: "21212-121212",
        id: 2
      },
      {
        name: "Kleopatra",
        number: "23323-4224",
        id: 3
      },
      {
        name: "Tullia",
        number: "2323-242323",
        id: 4
      },
      {
        name: "Vergilius",
        number: "23232-000001",
        id: 5
      }
    ]
    app.use(express.json())
    app.use(cors())

    
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

    const randomInt = (minimum, maximum) => {
        min = Math.ceil(minimum)
        max = Math.floor(maximum)
        return Math.floor(Math.random() * (max - min) + min)
    }

    const generateId = () => {
        const newId = randomInt(1, 1000000)
        return newId
    }


    app.post('/api/persons', (req, res) => {
        const person = req.body

        if (!person.name) {
            return res.status(400).json({ 
              error: 'name missing' 
            })
        } else if (!person.number) {
            return res.status(400).json({ 
                error: 'number missing' 
              })
        } else if (persons.some(p => p.name === person.name)) {
            return res.status(400).json({ 
                error: 'name must be unique' 
              })
        }

        const newperson = {
            name: person.name,
            number: person.number,
            id: generateId()
        }
        persons = persons.concat(newperson)
        res.json(person)
      })

    app.delete('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        persons = persons.filter(person => person.id !== id)
      
        res.status(204).end()
      })
      
    app.get('/api/persons', (req, res) => {
        res.json(persons)
    })

    app.get('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        const person = persons.find(person => person.id === id)
        if (person) {
            res.json(person)
          } else {
            res.status(404).end()
          }
    })

    app.get('/info', (req, res) => {
        res.send(
            `Phonebook has info for ${persons.length} people`
            + `<br><br/>` + `${Date()}`
        )
    })

/* Using port defined in env variable, and if not available, then 3001 */
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)