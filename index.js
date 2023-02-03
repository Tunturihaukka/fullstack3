const express = require('express')
const app = express()
const path = require('path');

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

      
    app.get('/api/persons', (req, res) => {
        res.json(persons)
    })

    app.get('/info', (req, res) => {
        res.send(
            `Phonebook has info for ${persons.length} people`
            + `<br><br/>` + `${Date()}`
        )
    })


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)