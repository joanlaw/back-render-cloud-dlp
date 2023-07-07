import { Router } from 'express'
import {
  getCardsen,
  createCardsen,
  updateCardsen,
  deleteCardsen,
  getCarden
} from '../controllers/cardsen.controllers.js'


const cardsrouter = Router()

import fileUpload from 'express-fileupload'

cardsrouter.get('/cards', getCardsen)
cardsrouter.post('/cards', fileUpload({
  useTempFiles: true, tempFileDir: './uploads'
}), createCardsen)
cardsrouter.put('/cards/:id', updateCardsen)
cardsrouter.delete('/cards/:id', deleteCardsen)
cardsrouter.get('/cards/:id', getCarden)


export default cardsrouter