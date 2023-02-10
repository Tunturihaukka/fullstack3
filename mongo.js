const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Vergilius:${password}@cluster0.4nwdcii.mongodb.net/luetteloApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
      })

} else if (process.argv.length === 3) {
    console.log(`phonebook`)
    Person.find({}).then(result => {
        for (let i = 0; i < result.length; i++){
            console.log(`${result[i].name} ${result[i].number}`)
        }
    }).then(result => {
        mongoose.connection.close()
    })
} else {
    mongoose.connection.close()
}

