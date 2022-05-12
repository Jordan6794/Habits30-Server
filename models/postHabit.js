import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema({
	name: { type: String, required: true },
	_id: { type: String, required: true },
	colors: { type: Array, required: true },
})

const Habit = mongoose.model('Habit', habitSchema)
export default Habit
