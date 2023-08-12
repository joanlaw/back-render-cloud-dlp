import { Router } from 'express';
import {
    getLeagues,
    createLeague,
    deleteLeague,
    updateLeague // no olvides importar este método
  } from '../controllers/leagues.controllers.js';

const leaguesRouter = Router();

leaguesRouter.get('/leagues', getLeagues);
leaguesRouter.post('/leagues', createLeague);
leaguesRouter.delete('/leagues/:id', deleteLeague);

leaguesRouter.put('/leagues/:id', updateLeague); // agrega esta línea

export default leaguesRouter;
