// routes/arquetipos.routes.js
import { Router } from 'express';
import {
  getArquetipos,
  createArquetipo,
  updateArquetipo,
  deleteArquetipo,
  getArquetipo,
} from '../controllers/arquetipos.controller.js';

const routerArquetipos = Router();

routerArquetipos.get('/arquetipos', getArquetipos);
routerArquetipos.post('/arquetipos', createArquetipo);
routerArquetipos.put('/arquetipos/:id', updateArquetipo);
routerArquetipos.delete('/arquetipos/:id', deleteArquetipo);
routerArquetipos.get('/arquetipos/:id', getArquetipo);

export default routerArquetipos;
