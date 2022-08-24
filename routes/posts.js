import express from 'express'

import { getHabbits, createHabbit, deleteHabit, updateHabit } from '../controllers/posts.js'
import { addEmbordingField } from '../controllers/scripts.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/', auth, getHabbits)
router.post('/', auth, createHabbit)
router.patch('/:id', auth, updateHabit)
router.delete('/:id', auth, deleteHabit)

router.post('/script', addEmbordingField)

export default router