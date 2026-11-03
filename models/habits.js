import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema({
	name: { type: String, required: true },
	_id: { type: String, required: true },
	createdOn: { type: String, required: true }, // 'YYYY-MM-DD'
	startDate: { type: String, required: true }, // 'YYYY-MM-DD', moved to the clear day on clear
	log: { type: Object, default: {} }, // { 'YYYY-MM-DD': 'success' | 'fail' }
	deletedOn: { type: String }, // 'YYYY-MM-DD', soft delete : hidden but still counted in the stats
})

const Habit = mongoose.model('Habit', habitSchema)
export default Habit
