import { Router } from 'express';
import {
  getTorneos,
  createTorneo,
  deleteTorneo
} from '../controllers/torneos.controllers.js';

const torneosRouter = Router();

torneosRouter.get('/torneos', getTorneos);
torneosRouter.post('/torneos', createTorneo);
torneosRouter.delete('/torneos/:id', deleteTorneo);

export default torneosRouter;
