import { Router } from 'express';
import multer from 'multer'; // Importa multer
import passport from 'passport';
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
   // getPlayerDeckById,
    updatePlayerDeck,   // Importa este método para actualizar
  deletePlayerDeck,  // Importa este método para eliminar
  getPlayerDeckByDiscordId,
  getPlayersAndDecksByLeagueId,
  startTournament, startNextRound, recordMatchResult, getMatchesByLeagueAndRound, createChatRoom, getChatRoomMessages, sendMessageToChatRoom, getMatchByPlayerLeagueAndRound, getCurrentRound, recordScores  
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
// Añade esta línea en tu archivo de rutas para usar el nuevo método
leaguesRouter.get('/leagues/:id/players-decks', getPlayersAndDecksByLeagueId);


leaguesRouter.post('/leagues', upload.single('image'), createLeague); // Utiliza el middleware "upload.single('file')" para manejar la subida de imágenes
leaguesRouter.post(
  '/leagues/:leagueId/playerdecks',
  upload.fields([
    { name: 'main_deck', maxCount: 1 },
    { name: 'extra_deck', maxCount: 1 },
    { name: 'side_deck', maxCount: 1 },
    { name: 'especial_deck', maxCount: 1 },
  ]),
  createPlayerDeck
);
//buscar id decks subidos
leaguesRouter.get('/leagues/:leagueId/playerdecks', getPlayerDeckByDiscordId);
//leaguesRouter.get('/leagues/:leagueId/playerdecks/:id', getPlayerDeckById);
// Actualizar un PlayerDeck
leaguesRouter.put('/leagues/:leagueId/playerdecks/:id', updatePlayerDeck);

// Eliminar un PlayerDeck
leaguesRouter.delete('/leagues/:leagueId/playerdecks/:id', deletePlayerDeck);



leaguesRouter.post('/leagues/:leagueId/enroll', enrollPlayer);  // ¡Añade esta línea!
leaguesRouter.delete('/leagues/:id', deleteLeague);

leaguesRouter.put('/leagues/:id', updateLeague); // agrega esta línea

//RUTAS PARA EMPAREJAMIENTOS
leaguesRouter.post('/leagues/:leagueId/start-tournament', startTournament); // Nueva ruta para iniciar el torneo
leaguesRouter.post('/leagues/:leagueId/start-next-round', startNextRound); // Nueva ruta para iniciar la siguiente ronda
leaguesRouter.post('/leagues/record-match-result', recordMatchResult); // Nueva ruta para registrar el resultado de un emparejamiento
leaguesRouter.get('/leagues/:id/rounds/:round/matches', getMatchesByLeagueAndRound);

leaguesRouter.post('/leagues/record-scores', recordScores);  // Nueva ruta para registrar los puntajes de un emparejamiento


leaguesRouter.get(
  '/leagues/:leagueId/rounds/:roundNumber/match',
  passport.authenticate('jwt', { session: false }),
  getMatchByPlayerLeagueAndRound
);

leaguesRouter.get('/leagues/:leagueId/current-round', getCurrentRound);


  // Ruta para crear una sala de chat
  leaguesRouter.post('/leagues/:leagueId/create-chat-room', createChatRoom);

  // Ruta para enviar un mensaje a una sala de chat
leaguesRouter.post(
  '/chat-rooms/:roomId/send-message',
  passport.authenticate('jwt', { session: false }),  // Añadir middleware de autenticación aquí
  sendMessageToChatRoom
);

  // Ruta para obtener los mensajes de una sala de chat
  leaguesRouter.get('/chat-rooms/:roomId/messages', getChatRoomMessages);



export default leaguesRouter;
