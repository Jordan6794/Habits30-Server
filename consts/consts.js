import { addDaysUTC, toUTCDateKey } from '../utils/dates.js'

export const signinTokenExpiresIn = '5d'
export const loginTokenExpiresIn = '100d'

// Example habits given to new users, the days are written backwards from yesterday ('s' success, 'f' fail)
const habitExamples = [
    { _id: '6bf09b5e-d452-448b-b936-95c68a2fda9a', name: 'Example 1 : Meditate 5 minutes', days: 'sfs' },
    { _id: '6bf09b5e-d455-448b-b936-95c68a2fda9a', name: 'Example 2 : Eat one fruit today', days: 'ssfss' },
    { _id: '6bf09b5e-d455-449b-b936-95c68a2fda9a', name: 'Example 3 : Read 15 minutes', days: 's' },
]

export function makeHabitExamples(now = new Date()) {
    const yesterday = addDaysUTC(toUTCDateKey(now), -1)
    return habitExamples.map(({ _id, name, days }) => {
        const createdOn = addDaysUTC(yesterday, -(days.length - 1))
        const log = {}
        days.split('').forEach((day, i) => {
            log[addDaysUTC(createdOn, i)] = day === 's' ? 'success' : 'fail'
        })
        return { _id, name, createdOn, startDate: createdOn, log }
    })
}
