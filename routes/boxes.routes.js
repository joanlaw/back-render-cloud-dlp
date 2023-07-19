import { Router } from 'express';
import {
  getBoxes,
  createBox,
  updateBox,
  deleteBox,
  getBox,
  getUbicacionCarta, // Importa la función getUbicacionCarta
} from '../controllers/boxes.controllerse.js';

const routerBoxes = Router();

routerBoxes.get('/boxes', getBoxes);
routerBoxes.post('/boxes', createBox);
routerBoxes.put('/boxes/:id', updateBox);
routerBoxes.delete('/boxes/:id', deleteBox);
routerBoxes.get('/boxes/:id', getBox);
routerBoxes.get('/boxes/:id/ubicacion', getUbicacionCarta); // Agrega la ruta para obtener la ubicación de una carta


export default routerBoxes;
