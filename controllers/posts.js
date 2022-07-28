import User from '../models/user.js'

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
		const { habit } = req.body
		
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
		const { habit } = req.body
		
		const { id } = req.params

		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
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
