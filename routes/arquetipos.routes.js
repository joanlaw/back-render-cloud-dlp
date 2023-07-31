// routes/arquetipos.routes.js
import { Router } from 'express';
import {
    getArquetipos,
    createArquetipo,
    updateArquetipo,
    deleteArquetipo,
    getArquetipo,
    getArquetipoByName, // no olvides importar esto
  } from '../controllers/arquetipos.controller.js';

const routerArquetipos = Router();

routerArquetipos.get('/arquetipos', getArquetipos);
routerArquetipos.post('/arquetipos', createArquetipo);
routerArquetipos.put('/arquetipos/:id', updateArquetipo);
routerArquetipos.delete('/arquetipos/:id', deleteArquetipo);
routerArquetipos.get('/arquetipos/:nombre_arquetipo', getArquetipoByName); // mover esta línea arriba de la de buscar por ID
routerArquetipos.get('/arquetipos/:id', getArquetipo);


export default routerArquetipos;
