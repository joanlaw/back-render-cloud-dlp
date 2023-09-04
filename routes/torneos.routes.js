import { Router } from 'express';
import {
  getTorneos,
  createTorneo,
  deleteTorneo,
  getTorneoById,
  getTorneoByNombre
} from '../controllers/torneos.controllers.js';

const torneosRouter = Router();

torneosRouter.get('/torneos', getTorneos);
torneosRouter.post('/torneos', createTorneo);
torneosRouter.delete('/torneos/:id', deleteTorneo);

// Nuevas rutas para buscar un torneo por su _id o por su nombre
torneosRouter.get('/torneos/id/:id', getTorneoById);
torneosRouter.get('/torneos/nombre/:nombre', getTorneoByNombre);

export default torneosRouter;
