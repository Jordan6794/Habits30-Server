import express from 'express'

import { signup, signin, googleauth, onboard } from '../controllers/user.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/googleauth', googleauth)

router.patch('/onboard', auth, onboard)

export default router
