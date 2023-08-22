import { Router } from 'express';
import multer from 'multer'; // Importa multer
import {
    getLeagues,
    createLeague,
    deleteLeague,
    updateLeague, // no olvides importar este método
    getLeagueById,  // importa este método
    enrollPlayer,  // ¡No olvides importar esto!
    getTournamentsByDiscordId,
    getLeaguesByOrganizer,
    getPlayersByLeagueId,
    createPlayerDeck,
    getPlayerDeckById
  } from '../controllers/leagues.controllers.js';

const leaguesRouter = Router();
// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // Nombre único para el archivo
  }
});
const upload = multer({ storage: storage });

leaguesRouter.get('/leagues', getLeagues);
leaguesRouter.get('/leagues/:id', getLeagueById); // agrega esta línea
leaguesRouter.get('/leagues/discordId/:discordId', getTournamentsByDiscordId);
leaguesRouter.get('/leagues/organizer/:discordId', getLeaguesByOrganizer);
leaguesRouter.get('/leagues/:id/players', getPlayersByLeagueId); // Agrega esta línea

leaguesRouter.post('/leagues', upload.single('image'), createLeague); // Utiliza el middleware "upload.single('file')" para manejar la subida de imágenes
leaguesRouter.post('/leagues/:leagueId/playerdecks', upload.single('image'), createPlayerDeck);
leaguesRouter.get('/leagues/:leagueId/playerdecks/:id', getPlayerDeckById);
leaguesRouter.post('/leagues/:leagueId/enroll', enrollPlayer);  // ¡Añade esta línea!
leaguesRouter.delete('/leagues/:id', deleteLeague);

leaguesRouter.put('/leagues/:id', updateLeague); // agrega esta línea

export default leaguesRouter;
