import Habit from "../models/postHabit.js"
import User from '../models/user.js'

export const habitScript = async (req, res) => {
    const myId = '627d1628671e792be3abb51f'
	const allHabits = await Habit.find()

    allHabits.forEach(async (habit) => {
        await User.findByIdAndUpdate(
            myId,
            {
                $push: {
                    habits: habit,
                },
            },
            {
                new: true,
            }
        )
    })
}

export const switchHabitsScript = async (req, res) => {
    const myId = '627d1628671e792be3abb51f'
	const user = await User.findById(myId)

    const finishedHabs = user.finished_habits
    finishedHabs.forEach(async (habit) => {
        await User.findByIdAndUpdate(
            myId,
            {
                $push: {
                    habits: habit,
                },
            },
            {
                new: true,
            }
        )
    })

    res.status(200).json('good')
}