// routes/duels.routes.js
import { Router } from 'express';
import {
  getDuels,
  createDuel,
  updateDuelResult
  // ... importar otros controladores según sean necesarios
} from '../controllers/duels.controller.js';

const duelsRouter = Router();

duelsRouter.get('/duels', getDuels);
duelsRouter.post('/duels', createDuel);
// Actualizar el resultado de un duelo por ID
duelsRouter.put('/duels/:id', updateDuelResult);


// Exportar el router
export default duelsRouter;
