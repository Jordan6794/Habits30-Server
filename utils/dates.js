// Dates are 'YYYY-MM-DD' strings, the client decides which habit day it is (user local time)

export const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/

export function toUTCDateKey(date) {
	return date.toISOString().slice(0, 10)
}

export function addDaysUTC(dateKey, days) {
	const date = new Date(`${dateKey}T12:00:00Z`)
	date.setUTCDate(date.getUTCDate() + days)
	return toUTCDateKey(date)
}

// Loose check against tampering : today + yesterday in any timezone always fit in this window
export function getEditableWindow(now = new Date()) {
	const serverToday = toUTCDateKey(now)
	return { first: addDaysUTC(serverToday, -2), last: addDaysUTC(serverToday, 1) }
}

export function isEditableDate(dateKey, now = new Date()) {
	const { first, last } = getEditableWindow(now)
	return DATE_KEY_REGEX.test(dateKey) && dateKey >= first && dateKey <= last
}
