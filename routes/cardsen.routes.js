import { Router } from 'express'
import {
  getCardsen,
  createCardsen,
  updateCardsen,
  deleteCardsen,
  getCarden,
  calculateCardCost,
  getFilteredCards
} from '../controllers/cardsen.controllers.js'


const cardsrouter = Router()

import fileUpload from 'express-fileupload'

cardsrouter.get('/cards', getCardsen)
cardsrouter.get('/filteredCards', getFilteredCards);
cardsrouter.post('/cards', fileUpload({
  useTempFiles: true, tempFileDir: './uploads'
}), createCardsen)
cardsrouter.put('/cards/:id', updateCardsen)
cardsrouter.delete('/cards/:id', deleteCardsen)
cardsrouter.get('/cards/:id', getCarden)
// Este middleware divide los IDs y los pasa a la función calculateCardCost
cardsrouter.get('/cards/:id/costo', (req, res, next) => {
  req.params.id = req.params.id.split(',');
  next();
}, calculateCardCost);

export default cardsrouter