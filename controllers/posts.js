import Habit from '../models/postHabit.js'
import User, {publicAccountId} from '../models/user.js'

export const getHabbits = async (req, res) => {
	try {
		const collection = req.query.collection
		if(collection !== 'habits' && collection !== 'finished_habits'){
			res.status(404).json({message: 'invalid collection'})
		}
		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}
			const habits = user[collection]

			res.status(200).json(habits)
		} else {
			const user = await User.findById(publicAccountId)
			if (!user) {
				return res.status(404).json({ message: 'Public Account not found' })
			}
			const habits = user[collection]

			res.status(200).json(habits)
		}
	} catch (error) {
		res.status(404).json({ message: error.message })
	}
}

export const createHabbit = async (req, res) => {
	try {
		const {habit, collection} = req.body
		if(collection !== 'habits' && collection !== 'finished_habits'){
			res.status(404).json({message: 'invalid collection'})
		}
		
		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			const updatedUser = await User.findByIdAndUpdate(
				req.userId,
				{
					$push: {
						[collection]: habit,
					},
				},
				{
					new: true,
				}
			)
			res.status(201).json(updatedUser)

		} else {
			const user = await User.findById(publicAccountId)
			if (!user) {
				return res.status(404).json({ message: 'Public Account not found' })
			}

			const updatedUser = await User.findByIdAndUpdate(
				publicAccountId,
				{
					$push: {
						[collection]: habit,
					},
				},
				{
					new: true,
				}
			)
			res.status(201).json(updatedUser)
		}
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const updateHabit = async (req, res) => {
	try {
		const {habit, collection} = req.body
		if(collection !== 'habits' && collection !== 'finished_habits'){
			res.status(404).json({message: 'invalid collection'})
		}
		
		const { id } = req.params

		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			const setKey = `${collection}.$[el]`
			const updatedUser = await User.findByIdAndUpdate(
				req.userId,
				{ $set: { [setKey]: habit } },
				{
					arrayFilters: [{ 'el._id': id }],
					new: true,
				}
			)
			res.json(updatedUser)
		} else {
			const user = await User.findById(publicAccountId)
			if (!user) {
				return res.status(404).json({ message: 'Public Account not found' })
			}

			const setKey = `${collection}.$[el]`
			const updatedUser = await User.findByIdAndUpdate(
				publicAccountId,
				{ $set: { [setKey]: habit } },
				{
					arrayFilters: [{ 'el._id': id }],
					new: true,
				}
			)
			res.json(updatedUser)
		}
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}

export const deleteHabit = async (req, res) => {
	try {
		const collection = req.query.collection
		if(collection !== 'habits' && collection !== 'finished_habits'){
			res.status(404).json({message: 'invalid collection'})
		}
		const { id } = req.params

		if (req.userId) {
			const user = await User.findById(req.userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			await User.findByIdAndUpdate(req.userId, {
				$pull: { [collection]: { _id: id } },
			})

			res.json({ message: 'habit deleted succesfully' })
		} else {
			const user = await User.findById(publicAccountId)
			if (!user) {
				return res.status(404).json({ message: 'Public Account not found' })
			}

			await User.findByIdAndUpdate(publicAccountId, {
				$pull: { [collection]: { _id: id } },
			})

			res.json({ message: 'habit deleted succesfully' })
		}
	} catch (error) {
		res.status(409).json({ message: error.message })
	}
}
