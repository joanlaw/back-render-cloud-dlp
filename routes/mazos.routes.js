import { Router } from 'express';
import {
  getMazos,
  createMazo,
  updateMazo,
  deleteMazo,
  getMazo,
} from '../controllers/mazos.controllers.js';

const routerMazos = Router();

routerMazos.get('/mazos', getMazos);
routerMazos.post('/mazos', createMazo);
routerMazos.put('/mazos/:id', updateMazo);
routerMazos.delete('/mazos/:id', deleteMazo);
routerMazos.get('/mazos/:id', getMazo);

export default routerMazos;
