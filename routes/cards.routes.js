import { Router } from 'express'
import {
  getCards,
  createCards,
  updateCards,
  deleteCards,
  getCard
} from '../controllers/cards.controllers.js'


const router = Router()

import fileUpload from 'express-fileupload'

router.get('/cartas', getCards)
router.post('/cartas', fileUpload({
  useTempFiles: true, tempFileDir: './uploads'
}), createCards)
router.put('/cartas/:id', updateCards)
router.delete('/cartas/:id', deleteCards)
router.get('/cartas/:id', getCard)


export default router