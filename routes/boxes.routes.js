import { Router } from 'express';
import {
  getBoxes,
  createBox,
  updateBox,
  deleteBox,
  getBox,
  getCajasPorIdCarta, // Importa la función getCajasPorIdCarta
} from '../controllers/boxes.controllerse.js';

const routerBoxes = Router();

routerBoxes.get('/boxes', getBoxes);
routerBoxes.post('/boxes', createBox);
routerBoxes.put('/boxes/:id', updateBox);
routerBoxes.delete('/boxes/:id', deleteBox);
routerBoxes.get('/boxes/:id', getBox);
routerBoxes.get('/boxes', getCajasPorIdCarta); // Actualiza la ruta para buscar cajas por ID de carta

export default routerBoxes;
