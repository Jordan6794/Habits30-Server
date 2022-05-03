import Habit from '../models/postHabit.js'

export const getHabbits = async (req, res) => {
	try {
		const habits = await Habit.find()

		res.status(200).json(habits)
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

export const createHabbit = async (req, res) => {
	try {
		const habitInfos = req.body
		console.log(habitInfos)
		const habitTest = new Habit(habitInfos)
		await habitTest.save()

		res.status(201).json(habitTest)
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const updateHabit = async (req, res) => {
	try {
		const { id } = req.params

		const isHabitExisting = await Habit.exists({ _id: id })
		if (!isHabitExisting) {
			return res
				.status(404)
				.send({ message: 'no habit to update with this id' })
		}

		const habitInfos = req.body
		console.log('habitInfos on server : ', habitInfos)

		const updatedHabit = await Habit.findByIdAndUpdate(
			id, habitInfos,
			{
				new: true,
			}
		)

		res.json(updatedHabit)
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const deleteHabit = async (req, res) => {
	try {
		const { id } = req.params

		const isHabitExisting = await Habit.exists({ _id: id })
		if (!isHabitExisting) {
			return res.status(404).send({ message: 'no habit with this id' })
		}
		await Habit.findByIdAndRemove(id)

		res.json({ message: 'habit deleted succesfully' })
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}
