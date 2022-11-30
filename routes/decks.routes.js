import { Router } from 'express'
import {
  getDecks,
  createDecks,
  updateDecks,
  deleteDecks,
  getDeck
} from '../controllers/decks.controllers.js'

const routerdecks = Router()

//import fileUpload from 'express-fileupload'
//import { getDecks } from '../controllers/decks.controllers'

routerdecks.get('/decks', getDecks)
routerdecks.post('/decks', createDecks)
routerdecks.put('/decks/:id', updateDecks)
routerdecks.delete('/decks/:id', deleteDecks)
routerdecks.get('/decks/:id', getDeck)

export default routerdecks