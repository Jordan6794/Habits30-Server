import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

import { habitExample1, habitExample2, habitExample3 } from '../consts/consts.js'
import { signinTokenExpiresIn, loginTokenExpiresIn } from '../consts/consts.js'

export const signin = async (req, res) => {
	const { email, password } = req.body
	try {
		const existingUser = await User.findOne({ email })
		if (!existingUser) {
			return res.status(404).json({ message: 'No user with this email.' })
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		)
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid credentials.' })
		}

		const token = jwt.sign(
			{ email: existingUser.email ,username: existingUser.username, id: existingUser._id },
			process.env.SECRET_KEY,
			{ expiresIn: loginTokenExpiresIn }
		)

		res.status(200).json({ result: existingUser, token })
	} catch (error) {
		res.status(500).json({ message: 'something went wrong' })
	}
}

export const signup = async (req, res) => {
	const { email, username, password, repeatPassword } = req.body

	try {
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(400).json({ message: 'There is already a user with this email.' })
		}

		if (password !== repeatPassword) {
			return res.status(400).json({ message: "Passwords don't match." })
		}

		bcrypt.hash(password, 12, async function (err, hash) {
			if (err) {
				res.status(500).json({ message: 'something went wrong' })
			}

			const result = await User.create({
				email,
				username,
				password: hash,
				habits: [habitExample1, habitExample2, habitExample3],
				hasOnboarded: false,
			})

			const token = jwt.sign(
				{ email: result.email, username: result.username, id: result._id },
				process.env.SECRET_KEY,
				{ expiresIn: signinTokenExpiresIn }
			)
			res.status(201).json({ result, token })
		})
	} catch (error) {
		res.status(500).json({ message: 'something went wrong' })
	}
}


export const googleauth = async (req, res) => {
	const { email, given_name, sub } = req.body

	try {
		const existingUser = await User.findOne({ email })

		// If user exists we log him in, if not we create a new account
		if (existingUser) {
			const token = jwt.sign(
				{ email: existingUser.email ,username: existingUser.username, id: existingUser._id },
				process.env.SECRET_KEY,
				{ expiresIn: loginTokenExpiresIn }
			)
	
			res.status(200).json({ result: existingUser, token })
		} else {
			const result = await User.create({
				email,
				username: given_name,
				habits: [habitExample1, habitExample2, habitExample3],
				hasOnboarded: false,
			})
	
			const token = jwt.sign(
				{ email: result.email, username: result.username, id: result._id },
				process.env.SECRET_KEY,
				{ expiresIn: signinTokenExpiresIn }
			)
			res.status(201).json({ result, token })
		}


	} catch (error) {
		res.status(500).json({ message: 'something went wrong' })
	}

}