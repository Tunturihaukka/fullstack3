require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI


mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberValidator = (number) => {
  // Validation for a phone number
  if (number.length < 9) {
    return false
  }
  return /^(\d{2})(\d{1})?-\d+$/.test(number)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate : [numberValidator, 'Given number is not a valid phone number!']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)