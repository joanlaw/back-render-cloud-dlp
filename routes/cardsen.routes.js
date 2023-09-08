import { Router } from 'express'
import {
  getCardsen,
  createCardsen,
  updateCardsen,
  deleteCardsen,
  getCarden,
  updateCardsenByNombre
} from '../controllers/cardsen.controllers.js'


const cardsrouter = Router()

import fileUpload from 'express-fileupload'

cardsrouter.get('/cards', getCardsen)
cardsrouter.post('/cards', fileUpload({
  useTempFiles: true, tempFileDir: './uploads'
}), createCardsen)
cardsrouter.put('/cards/:id', updateCardsen)
// Ruta para actualizar por nombre
cardsRouter.put('/cards/:nombre', updateCardsenByNombre);
cardsrouter.delete('/cards/:id', deleteCardsen)
cardsrouter.get('/cards/:id', getCarden)


export default cardsrouter