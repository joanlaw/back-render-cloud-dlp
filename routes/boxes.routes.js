import { Router } from 'express';
import {
  getBoxes,
  createBox,
  updateBox,
  deleteBox,
  getBox,
} from '../controllers/boxes.controllerse.js';

const routerBoxes = Router();

routerBoxes.get('/boxes', getBoxes);
routerBoxes.post('/boxes', createBox);
routerBoxes.put('/boxes/:id', updateBox);
routerBoxes.delete('/boxes/:id', deleteBox);
routerBoxes.get('/boxes/:id', getBox);

export default routerBoxes;
