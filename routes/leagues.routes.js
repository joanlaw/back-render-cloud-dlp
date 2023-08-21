import { Router } from 'express';
import {
    getLeagues,
    createLeague,
    deleteLeague,
    updateLeague, // no olvides importar este método
    getLeagueById,  // importa este método
    enrollPlayer,  // ¡No olvides importar esto!
    getTournamentsByDiscordId,
    getLeaguesByOrganizer
  } from '../controllers/leagues.controllers.js';

const leaguesRouter = Router();

leaguesRouter.get('/leagues', getLeagues);
leaguesRouter.get('/leagues/:id', getLeagueById); // agrega esta línea
leaguesRouter.get('/leagues/discordId/:discordId', getTournamentsByDiscordId);
leaguesRouter.get('/leagues/organizer/:discordId', getLeaguesByOrganizer);

leaguesRouter.post('/leagues', createLeague);
leaguesRouter.post('/leagues/:leagueId/enroll', enrollPlayer);  // ¡Añade esta línea!
leaguesRouter.delete('/leagues/:id', deleteLeague);

leaguesRouter.put('/leagues/:id', updateLeague); // agrega esta línea

export default leaguesRouter;
