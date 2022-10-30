import { Timestamp } from 'mongodb'
import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  zip: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
})

const Reservation = mongoose.model('Reservation', reservationSchema)
export default Reservation
