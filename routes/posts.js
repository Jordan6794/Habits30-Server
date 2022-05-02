import express from 'express'
import { getHabbits, createHabbit, deleteHabit, updateHabit } from '../controllers/posts.js'

const router = express.Router()

router.get('/', getHabbits)
router.post('/', createHabbit)
router.patch('/:id', updateHabit)
router.delete('/:id', deleteHabit)

export default router