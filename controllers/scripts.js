import Habit from "../models/habits.js"
import User from '../models/user.js'
import { toUTCDateKey } from '../utils/dates.js'

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

export const addLifetimeStatsScript = async (req, res) => {
    const allUsers = await User.find({})

    allUsers.forEach(async (user) => {
        const habits = user.habits
        const id = user._id

        habits.forEach(async (habit) => {
            const habitId = habit._id
            const successCount = habit.successCounter
            const failCount = habit.failCounter
    
            const lifetimeSuccessCounter = successCount
            const lifetimeFailCounter = failCount
            const newHabit = {...habit, lifetimeSuccessCounter, lifetimeFailCounter}
             
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: { 'habits.$[el]': newHabit } },
                {
                    arrayFilters: [{ 'el._id': habitId }],
                    new: true,
                }
            )
        })
    })

    res.status(200).json('good')
}

export const addEmbordingField = async (req, res) => {
    const allUsers = await User.find({})
    // const myId = '62f2401525e8f92efc54065a'
    
    allUsers.forEach(async (user) => {
        const id = user._id
        await User.findByIdAndUpdate(
            id,
            {
                hasOnboarded: true
            },
            {
                new: true,
            }
        )
        
    })

    res.status(200).json('good')
}

// Switching every habit to the daily log : all habits restart empty from today
export const resetHabitsToDailyLogScript = async (req, res) => {
    const today = toUTCDateKey(new Date())
    const allUsers = await User.find({})

    await Promise.all(allUsers.map((user) => {
        const habits = user.habits.map(({ _id, name }) => ({ _id, name, createdOn: today, startDate: today, log: {} }))
        return User.findByIdAndUpdate(user._id, { $set: { habits } })
    }))

    res.status(200).json('good')
}
