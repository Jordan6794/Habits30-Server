import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema({
    name: String,
    _id: String,
    colors: Array
})

const Habit = mongoose.model('Habit', habitSchema)
export default Habit