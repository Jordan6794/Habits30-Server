import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signin = async (req, res) => {
	const { username, password } = req.body
	try {
		const existingUser = await User.findOne({ username })
		if (!existingUser) {
			return res.status(404).json({ message: 'No user with this username' })
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		)
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid credentials.' })
		}

		const token = jwt.sign(
			{ username: existingUser.username, id: existingUser._id },
			process.env.SECRET_KEY,
			{ expiresIn: '10d' }
		)

		res.status(200).json({ result: existingUser, token })
	} catch (error) {
		res.status(500).json({ message: 'something went wrong' })
	}
}

export const signup = async (req, res) => {
	const { username, password, repeatPassword } = req.body

	try {
		const existingUser = await User.findOne({ username })
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists.' })
		}

		if (password !== repeatPassword) {
			return res.status(400).json({ message: "Passwords don't match" })
		}

		bcrypt.hash(password, 12, async function (err, hash) {
			if (err) {
				res.status(500).json({ message: 'something went wrong' })
			}

			const habitExample1 = {
				_id: '6bf09b5e-d452-448b-b936-95c68a2fda9a',
				name: 'Example 1 : Brush my teeth',
				colors: ['g', 'r', 'g'],
			}
			const habitExample2 = {
				_id: '6bf09b5e-d455-448b-b936-95c68a2fda9a',
				name: 'Example 2 : Eat one fruit today',
				colors: ['g', 'g', 'r', 'g'],
			}

			const result = await User.create({
				username,
				password: hash,
				habits: [habitExample1, habitExample2],
			})

			const token = jwt.sign(
				{ username: result.username, id: result._id },
				process.env.SECRET_KEY,
				{ expiresIn: '10d' }
			)
			res.status(201).json({ result, token })
		})
	} catch (error) {
		res.status(500).json({ message: 'something went wrong' })
	}
}
