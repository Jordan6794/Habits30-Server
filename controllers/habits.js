import User from '../models/user.js'
import { DATE_KEY_REGEX, getEditableWindow, isEditableDate } from '../utils/dates.js'

const DAY_STATUSES = ['success', 'fail']

// Only the stored fields are saved, colors and counters are computed by the client from the log
function toStoredHabit(habit) {
	const { name, _id, createdOn, startDate, log } = habit
	return { name, _id, createdOn, startDate, log: log ?? {} }
}

// Returns true if the new log changes a day that is not editable anymore
function changesLockedDays(oldLog = {}, newLog = {}) {
	const { first } = getEditableWindow()
	const dates = new Set([...Object.keys(oldLog), ...Object.keys(newLog)])
	return [...dates].some((date) => date < first && oldLog[date] !== newLog[date])
}

function isValidLog(log) {
	return Object.entries(log).every(([date, status]) => DATE_KEY_REGEX.test(date) && DAY_STATUSES.includes(status))
}

export const getHabbits = async (req, res) => {
	try {
		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}
			const habits = user.habits

			res.status(200).json(habits)
		} else {
			return res.status(404).json({ message: 'No user provided' })
		}
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

export const createHabbit = async (req, res) => {
	try {
		const habit = toStoredHabit(req.body.habit)
		
		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			const updatedUser = await User.findByIdAndUpdate(
				req.userId,
				{
					$push: {
						habits: habit,
					},
				},
				{
					new: true,
				}
			)
			res.status(201).json(updatedUser)

		} else {
			res.status(409).json({message: 'no user provided'})
		}
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const updateHabit = async (req, res) => {
	try {
		const habit = toStoredHabit(req.body.habit)
		
		const { id } = req.params

		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			const oldHabit = user.habits.find((userHabit) => userHabit._id === id)
			if (!isValidLog(habit.log) || changesLockedDays(oldHabit?.log, habit.log)) {
				return res.status(400).json({ message: 'Only today and yesterday can be changed' })
			}

			const updatedUser = await User.findByIdAndUpdate(
				req.userId,
				{ $set: { 'habits.$[el]': habit } },
				{
					arrayFilters: [{ 'el._id': id }],
					new: true,
				}
			)
			res.json(updatedUser)
		} else {
			res.status(409).json({message: 'no user provided'})
		}
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

// Sets (or removes with a null status) the result of one day
export const setLogEntry = async (req, res) => {
	try {
		const { date, status } = req.body
		const { id } = req.params

		if (!req.userId) {
			return res.status(409).json({ message: 'no user provided' })
		}
		if (!isEditableDate(date) || !(status === null || DAY_STATUSES.includes(status))) {
			return res.status(400).json({ message: 'Only today and yesterday can be changed' })
		}

		const logPath = `habits.$[el].log.${date}`
		const update = status === null ? { $unset: { [logPath]: '' } } : { $set: { [logPath]: status } }
		const updatedUser = await User.findByIdAndUpdate(req.userId, update, {
			arrayFilters: [{ 'el._id': id }],
			new: true,
		})
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.json(updatedUser)
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const deleteHabit = async (req, res) => {
	try {
		const { id } = req.params

		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			await User.findByIdAndUpdate(req.userId, {
				$pull: { habits: { _id: id } },
			})

			res.json({ message: 'habit deleted succesfully' })
		} else {
			res.status(409).json({message: 'no user provided'})
		}
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}
