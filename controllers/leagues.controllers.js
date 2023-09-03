import mongoose from 'mongoose'; // Importa mongoose
import League from '../models/league.model.js';
import User from '../models/User.js'
import { v4 as uuidv4 } from 'uuid';
import ChatRoom from '../models/ChatRoom.model.js';
import ChatMessage from '../models/ChatMessage.model.js';
import uploadToImgbb from '../utils/imgbb.js';
import PlayerDeck from '../models/playerDeck.model.js';


// METODO GET/
export const getLeagues = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10),
      populate: 'organizer' // Esto poblará el campo 'organizer' con el documento completo del usuario
    };

    const query = {
      league_name: { $regex: search, $options: 'i' }
    };

    const leagues = await League.paginate(query, options);

    // Obtener los usernames de los jugadores y reemplazar los IDs
    const leaguesWithUsernames = await Promise.all(
      leagues.docs.map(async league => {
        const playersWithUsernames = await Promise.all(
          league.players.map(async playerId => {
            const player = await User.findById(playerId);
            return player ? player.username : 'Jugador Desconocido';
          })
        );

        return {
          ...league.toObject(),
          players: playersWithUsernames
        };
      })
    );

    res.send({ ...leagues, docs: leaguesWithUsernames });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// METODO GET por ID
export const getLeagueById = async (req, res) => {
  try {
    const { id } = req.params;
    const league = await League.findById(id);

    if (!league) {
      return res.status(404).json({ message: 'La liga no existe' });
    }

    res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// METODO POST
// METODO POST
export const createLeague = async (req, res) => {
  try {
    let { league_name, league_format, start_date, enlace_torneo, infoTorneo, organizer, reglas } = req.body;

    // Aquí agregamos la verificación y el parseo
    if (typeof infoTorneo === 'string') {
      infoTorneo = JSON.parse(infoTorneo);
    }

    const user = await User.findOne({ discordId: organizer });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let image;
    if (req.file) {
      image = await uploadToImgbb(req.file.path);
    }

    const league = new League({
      league_name,
      league_format,
      start_date: new Date(start_date),
      image: {
        url: image.url // Utiliza solo la URL de la imagen
      },
      reglas,
      enlace_torneo,
      infoTorneo,
      organizer: user._id,
    });

    await league.save();

    res.json(league);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


// METODO PUT
export const updateLeague = async (req, res) => {
  try {
    const { league_name, league_format, start_date, enlace_torneo, image_torneo, infoTorneo, reglas } = req.body;

    let league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'La liga no existe' });
    }

    // Verificar que el usuario que hace la solicitud es el organizador del torneo
    if (league.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: 'No tienes permiso para modificar este torneo' });
    }

    if (league_name) league.league_name = league_name;
    if (league_format) league.league_format = league_format;
    if (start_date) league.start_date = start_date;
    if (enlace_torneo) league.enlace_torneo = enlace_torneo;
    if (image_torneo) league.image_torneo = image_torneo;
    if (infoTorneo) league.infoTorneo = infoTorneo;
    if (reglas) league.reglas = reglas; // Agrega el campo "reglas"

    await league.save();

    res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO DELETE
// METODO DELETE
export const deleteLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'La liga no existe' });
    }
    
    // Verificar que el usuario que hace la solicitud es el organizador del torneo
    if (league.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este torneo' });
    }

    await league.remove();

    return res.json({ message: 'Liga eliminada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Inscribir un jugador en el torneo
export const enrollPlayer = async (req, res) => {
  try {
    const { leagueId } = req.params; 
    const { playerId } = req.body;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    // Buscar al usuario por su discordId
    const player = await User.findOne({ discordId: playerId });
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    // Convertir el discordId en ObjectId
    const playerIdObjectId = mongoose.Types.ObjectId(player._id);

    // Agregar el ID del jugador al campo `players` del torneo
    if (!league.players.includes(playerIdObjectId)) {
      league.players.push(playerIdObjectId);
      await league.save();
    }

    return res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO PARA ACCEDER A LOS MATCHUPS 
export const getMatchesByLeagueAndRound = async (req, res) => {
  try {
    const { id, round } = req.params;
    const league = await League.findById(id);
    if (!league) {
      return res.status(404).json({ message: "Liga no encontrada" });
    }
    const matches = league.rounds[round - 1]?.matches || [];
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error });
  }
};

//LOGICA PARA TORNEO ALGORITMOS DE EMPAREJAMIENTO*****************************************************************************************************************
// Iniciar el torneo y crear emparejamientos para la primera ronda
// Función para calcular el número total de rondas:
/*const calculateTotalRounds = (playerCount) => {
  let totalRounds = 0;
  while (playerCount > 1) {
    playerCount = Math.ceil(playerCount / 2);
    totalRounds++;
  }
  return totalRounds;
};  */



const nextPowerOf2 = n => Math.pow(2, Math.ceil(Math.log2(n)));

export const startTournament = async (req, res) => {
  try {
    console.log('Inicio de startTournament');

    const { leagueId } = req.params;
    const league = await League.findById(leagueId).populate('players');

    if (!league) {
      console.log('Torneo no encontrado');
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    if (league.status !== 'open') {
      console.log('Torneo ya en progreso o finalizado');
      return res.status(400).json({ message: 'No puedes iniciar un torneo ya en progreso o finalizado.' });
    }

    const totalPlayers = league.players.length;
    console.log(`Total de jugadores: ${totalPlayers}`);

    const requiredPlayers = nextPowerOf2(totalPlayers);
    console.log(`Jugadores requeridos para torneo completo: ${requiredPlayers}`);

    const totalRounds = Math.log2(requiredPlayers);
    console.log(`Total de rondas: ${totalRounds}`);

    let matchCounter = 1;
    const rounds = [];

    let remainingPlayers = [...Array(requiredPlayers).keys()].map(i => {
      return i < totalPlayers ? league.players[i]._id : 'BYE';
    });

    console.log('Jugadores iniciales:', remainingPlayers);

    for (let r = 1; r <= totalRounds; r++) {
      console.log(`Creando ronda ${r}`);

      const roundMatches = [];
      const nextRoundPlayers = [];

      for (let i = 0; i < remainingPlayers.length; i += 2) {
        const player1 = remainingPlayers[i];
        const player2 = remainingPlayers[i + 1];

        console.log(`Emparejando ${player1} con ${player2}`);

        const newMatch = {
          matchNumber: matchCounter++,
          player1,
          player2,
          winner: null,
          result: '',
          scores: { player1: 0, player2: 0 },
          status: (player1 === 'BYE' || player2 === 'BYE') ? 'completed' : 'pending'
        };

        roundMatches.push(newMatch);

        // Asumiendo que quieres guardar el número del partido para futuras referencias
        nextRoundPlayers.push(null); // El ganador del partido se determinará más tarde
      }

      rounds.push({ matches: roundMatches });
      remainingPlayers = nextRoundPlayers; // Ahora nextRoundPlayers solo contiene ObjectIds o nulos
    }

    league.rounds = rounds;
    league.totalRounds = totalRounds;
    league.current_round = 1;
    league.status = 'in_progress';

    league.markModified('rounds');
    await league.save();

    console.log('Torneo iniciado con éxito');
    return res.json(league);

  } catch (error) {
    console.error('Error al iniciar el torneo:', error);
    return res.status(500).json({ message: error.message });
  }
};


//

export const startNextRound = async (req, res) => {
  try {
    console.log('Inicio de la función startNextRound');

    const { leagueId } = req.params;
    const league = await League.findById(leagueId);

    if (!league) {
      console.log('Torneo no encontrado');
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    if (league.status !== 'in_progress') {
      console.log('El torneo no está en progreso.');
      return res.status(400).json({ message: 'El torneo no está en progreso.' });
    }

    const currentRound = league.rounds[league.current_round - 1];
    const winners = currentRound.matches.map(match => match.winner === 'BYE' ? match.player1 : match.winner).filter(w => w);

    if (winners.includes(null)) {
      console.log('Todavía hay partidos pendientes en esta ronda.');
      return res.status(400).json({ message: 'Todavía hay partidos pendientes en esta ronda.' });
    }

    if (league.current_round >= league.totalRounds) {
      console.log('El torneo ha terminado');
      league.status = 'finalized';
      await league.save();
      return res.json({ message: 'El torneo ha terminado', league });
    }

    const nextRoundMatches = [];
    let waitingForMatchNumber = league.rounds.flat().length + 1;

    for (let i = 0; i < winners.length; i += 2) {
      const newChatRoom = await ChatRoom.create({ /* ... */ });

      const player1 = winners[i];
      const player2 = winners[i + 1] || 'BYE';

      const winner = player2 === 'BYE' ? player1 : null;

      nextRoundMatches.push({
        matchNumber: waitingForMatchNumber++,
        player1: player1,
        player2: player2,
        winner: winner,
        chatRoom: newChatRoom._id,
        result: '',
        status: player2 === 'BYE' ? 'completed' : 'pending',
        scores: {
          player1: player2 === 'BYE' ? 1 : 0,
          player2: 0
        }
      });
    }

    league.rounds.push({ matches: nextRoundMatches });
    league.current_round++;
    await league.save();

    console.log('Nueva ronda iniciada');
    return res.json({ message: 'Nueva ronda iniciada', league });

  } catch (error) {
    console.error('Error al iniciar la siguiente ronda:', error);
    return res.status(500).json({ message: error.message });
  }
};





//
export const recordScores = async (req, res) => {
  try {
    console.log("Inside recordScores function");

    const { leagueId, roundNumber } = req.params;
    const { matchId, scorePlayer1, scorePlayer2 } = req.body;

    const league = await League.findById(leagueId);

    if (!league) {
      console.log("League not found.");
      return res.status(404).json({ message: 'League not found.', location: 'League.findById' });
    }

    const round = league.rounds[roundNumber - 1];

    if (!round) {
      console.log("Round not found.");
      return res.status(404).json({ message: 'Round not found.', location: 'rounds array' });
    }

    const match = round.matches.find(match => match._id.toString() === matchId);

    if (!match) {
      console.log("Match not found.");
      return res.status(404).json({ message: 'Match not found.', location: 'matches array' });
    }

    // Skip updating scores if the match is a BYE
    if (match.player1 === 'BYE' || match.player2 === 'BYE') {
      console.log("This match is a BYE. No need to record scores.");
      return res.status(400).json({ message: 'This match is a BYE. No need to record scores.' });
    }

    match.scores.player1 = scorePlayer1;
    match.scores.player2 = scorePlayer2;

    if (scorePlayer1 > scorePlayer2) {
      match.winner = match.player1;
    } else if (scorePlayer2 > scorePlayer1) {
      match.winner = match.player2;
    } else {
      match.winner = 'draw';
    }

    await league.save();
    console.log("Scores and winner recorded successfully.");
    console.log("Updated League:", league);

    res.status(200).json({ message: 'Scores and winner recorded successfully' });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message, location: 'Catch block' });
  }
};




//
export const recordMatchResult = async (req, res) => {
  try {
    const { leagueId, roundNumber, matchId, chatRoom, result } = req.body;
    // ... (logs omitidos para brevedad)

    const league = await League.findById(leagueId);

    if (!league) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    if (league.status !== 'in_progress') {
      return res.status(400).json({ message: 'El torneo no está en progreso.' });
    }

    const round = league.rounds[roundNumber - 1];
    const match = round.matches.id(matchId);

    if (!match) {
      return res.status(404).json({ message: 'Emparejamiento no encontrado' });
    }

    // Aquí es donde añadimos la lógica para manejar el caso de un jugador sin pareja
    if (match.player2 === null) {
      match.winner = match.player1;
      match.result = 'Player1 wins by default';  // Puedes cambiar este mensaje
    } else {
      // Aquí iría el resto del código que maneja los resultados del partido
      // ...
    }

    await league.save();
    return res.status(200).json({ message: 'Resultado registrado con éxito' });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: error.message });
  }
};



///TERMINA ALGORITMOS

export const getMatchByPlayerLeagueAndRound = async (req, res) => {
  try {
    console.log('Entrando a getMatchByPlayerLeagueAndRound');

    const { leagueId, roundNumber } = req.params;
    console.log(`Parametros: leagueId=${leagueId}, roundNumber=${roundNumber}`);

    const { discordId } = req.user;  // Obtenido desde el token JWT
    console.log(`discordId del usuario: ${discordId}`);

    // Busca el _id del usuario basado en su discordId
    const user = await User.findOne({ discordId });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log(`Usuario encontrado: ${JSON.stringify(user)}`);

    // Ahora usamos el _id de MongoDB para buscar el emparejamiento
    const userId = user._id;
    console.log(`userId de MongoDB: ${userId}`);

    const league = await League.findById(leagueId);
    if (!league) {
      console.log('Torneo no encontrado');
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }
    console.log(`Torneo encontrado: ${JSON.stringify(league)}`);

    if (roundNumber > league.current_round || roundNumber <= 0) {
      console.log('Ronda no válida');
      return res.status(400).json({ message: 'Ronda no válida' });
    }

    const round = league.rounds[roundNumber - 1];
    console.log(`Ronda: ${JSON.stringify(round)}`);

    const ObjectId = mongoose.Types.ObjectId;
    
    const match = round.matches.find(m => 
      m.player1.equals(ObjectId(userId)) || m.player2.equals(ObjectId(userId))
    );
    

    if (!match) {
      console.log('Emparejamiento no encontrado');
      return res.status(404).json({ message: 'Emparejamiento no encontrado' });
    }
    console.log(`Emparejamiento encontrado: ${JSON.stringify(match)}`);
    
    return res.json(match);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};



export const getCurrentRound = async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    const league = await League.findById(leagueId);

    if (!league) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    return res.json({ current_round: league.current_round });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


/*****TEMINA LOGICA DE EMPAREJAMIENTO ********************************************************************************************************* */

/*******************COMIENZA CHATROOM FUNCIONES**************************** */

// Función para crear una sala de chat
export const createChatRoom = async (req, res) => {
  try {
    const { leagueId } = req.params;
    
    const chatRoom = await ChatRoom.create({
      league: leagueId,
      // No es necesario almacenar los participantes si la sala es abierta
    });

    return res.json(chatRoom);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función para obtener los mensajes de una sala de chat
export const getChatRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const messages = await ChatMessage.find({ chatRoom: roomId });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Función para enviar un mensaje a una sala de chat
// Función para enviar un mensaje a una sala de chat
export const sendMessageToChatRoom = async (req, res) => {
  try {
    console.log("Inicio de sendMessageToChatRoom");  // Añadir log para seguimiento
    const { roomId } = req.params;
    const { content, username } = req.body;
    const discordId = req.query.discordId;  // Obtener discordId desde query parameters

    const message = await ChatMessage.create({
      chatRoom: roomId,
      content,
      sender: {
        discordId,
        username,
      }
    });

    console.log("Mensaje enviado exitosamente:", message);  // Añadir log para seguimiento
    return res.json(message);
  } catch (error) {
    console.error("Error en sendMessageToChatRoom:", error);  // Añadir log para seguimiento
    return res.status(500).json({ message: error.message });
  }
};





/************TERMINA CHATROOM FUNCIONES*********** */

// METODO GET DISCORDID
export const getTournamentsByDiscordId = async (req, res) => {
  try {
    const { discordId } = req.params;

    const user = await User.findOne({ discordId: discordId });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const leagues = await League.find({ players: user._id });

    return res.json(leagues);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO GET por DiscordId del organizador
export const getLeaguesByOrganizer = async (req, res) => {
  try {
    const { discordId } = req.params;
    const user = await User.findOne({ discordId: discordId });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const leagues = await League.find({ organizer: user._id });
    return res.json(leagues);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//para saber los players de una liga o torneo inscritos
export const getPlayersByLeagueId = async (req, res) => {
  try {
    const { id } = req.params;
    const league = await League.findById(id);

    if (!league) {
      return res.status(404).json({ message: 'El torneo no existe' });
    }

    const players = await User.find({ _id: { $in: league.players } }); // Obtén los jugadores por sus IDs

    return res.json(players);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener jugadores y sus decks por ID de la liga
export const getPlayersAndDecksByLeagueId = async (req, res) => {
  try {
    const { id } = req.params;
    const league = await League.findById(id).populate('playerDecks'); // Usamos populate para obtener también los PlayerDecks

    if (!league) {
      return res.status(404).json({ message: 'El torneo no existe' });
    }

    const players = await User.find({ _id: { $in: league.players } }); // Obtén los jugadores por sus IDs
    const playerDecks = await PlayerDeck.find({ leagueId: id }); // Obtén los PlayerDecks por ID de la liga

    return res.json({ players, playerDecks });  // Devuelve tanto los jugadores como sus PlayerDecks
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE PLAYERS EN LEAGUES 
export const removePlayerFromLeague = async (req, res) => {
  try {
    const { id, playerId } = req.params;

    // Encuentra la liga por ID
    const league = await League.findById(id);

    if (!league) {
      return res.status(404).json({ message: 'El torneo no existe' });
    }

    // Filtra los jugadores para eliminar el ID del jugador
    league.players = league.players.filter(player => {
      const isMatch = player.toString() === playerId;
      if (isMatch) {
        console.log(`Eliminando jugador con ID ${playerId}`);
      }
      return !isMatch;
    });

    // Guarda la liga actualizada
    await league.save();

    console.log('Liga actualizada:', league);

    return res.json({ message: 'Jugador eliminado de la liga' });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    return res.status(500).json({ message: error.message });
  }
};


//cargar imagenes de decks 
export const createPlayerDeck = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No se enviaron archivos' });
    }

    const { discordId } = req.query;
    const leagueId = req.params.leagueId;

    const user = await User.findOne({ discordId });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const decks = ['main_deck', 'extra_deck', 'side_deck', 'especial_deck'];
    const uploads = {};

    for (const deck of decks) {
      if (req.files[deck] && req.files[deck][0]) {
        uploads[deck] = await uploadToImgbb(req.files[deck][0].path);
      } else {
        uploads[deck] = { url: null };  // O un valor por defecto, si lo prefieres
      }
    }

    const newPlayerDeck = new PlayerDeck({
      user: user._id,
      leagueId,
      main_deck: { url: uploads['main_deck'].url },
      extra_deck: { url: uploads['extra_deck'].url },
      side_deck: { url: uploads['side_deck'].url },
      especial_deck: { url: uploads['especial_deck'].url },
    });

    await newPlayerDeck.save();

    await League.findByIdAndUpdate(leagueId, {
      $push: { playerDecks: newPlayerDeck._id }
    });

    res.status(201).json(newPlayerDeck);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al crear el mazo del jugador.' });
  }
};


//GET ID DECK PLAYER
export const getPlayerDeck = async (req, res) => {
  try {
      const playerDeckId = req.params.id; 
      const playerDeck = await PlayerDeck.findById(playerDeckId);
      
      if (!playerDeck) {
          return res.status(404).json({ error: 'Mazo del jugador no encontrado.' });
      }
      
      res.status(200).json(playerDeck);
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al obtener el mazo del jugador.' });
  }
};

//UPDATE PLAYERID
export const updatePlayerDeck = async (req, res) => {
  try {
      const playerDeckId = req.params.id;
      const updatedDeck = req.body; 
      
      const playerDeck = await PlayerDeck.findByIdAndUpdate(playerDeckId, updatedDeck, { new: true });
      
      if (!playerDeck) {
          return res.status(404).json({ error: 'Mazo del jugador no encontrado.' });
      }
      
      res.status(200).json(playerDeck);
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al actualizar el mazo del jugador.' });
  }
};

//DELETE PLAYERID
export const deletePlayerDeck = async (req, res) => {
  try {
      const playerDeckId = req.params.id;
      
      const playerDeck = await PlayerDeck.findByIdAndRemove(playerDeckId);
      
      if (!playerDeck) {
          return res.status(404).json({ error: 'Mazo del jugador no encontrado.' });
      }
      
      // También deberías considerar eliminar el ID del PlayerDeck del array playerDecks en la Liga.
      await League.updateMany({}, { $pull: { playerDecks: playerDeckId } });

      res.status(200).json({ message: 'Mazo del jugador eliminado con éxito.' });
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al eliminar el mazo del jugador.' });
  }
};

  export const getPlayerDeckByDiscordId = async (req, res) => {
    try {
      const { leagueId } = req.params;
      const { discordId } = req.query;

      console.log('Buscando usuario con discordId:', discordId);
      const user = await User.findOne({ discordId });

      if (!user) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      console.log('Usuario encontrado:', user);
      console.log(`Buscando mazo con userId: ${user._id} y leagueId: ${leagueId}`);
      
      const playerDeck = await PlayerDeck.findOne({ user: user._id, leagueId: leagueId });

      console.log('Consulta realizada:', PlayerDeck.findOne({ user: user._id, league: leagueId }).getFilter());
      
      if (!playerDeck) {
        console.log('Mazo no encontrado para el usuario y la liga especificados:', user._id, leagueId);
        return res.status(404).json({ error: 'Mazo no encontrado para el usuario especificado' });
      }

      console.log('Mazo encontrado - Main Deck:', playerDeck.main_deck.url);
      console.log('Mazo encontrado - Extra Deck:', playerDeck.extra_deck.url);
      console.log('Mazo encontrado - Side Deck:', playerDeck.side_deck.url);
      console.log('Mazo encontrado - Especial Deck:', playerDeck.especial_deck.url);

      res.status(200).json(playerDeck);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el mazo del jugador' });
    }
  };

  // Obtener todos los partidos para un jugador en una liga específica
// Obtener todos los partidos para un jugador en una liga específica
export const getMatchesByPlayerAndLeagueId = async (req, res) => {
  try {
    const { leagueId, discordId } = req.params;
    
    console.log("Received leagueId:", leagueId);
    console.log("Received discordId:", discordId);

    if (!discordId || !leagueId) {
      console.log("Missing parameters.");
      return res.status(400).json({ message: 'Faltan parámetros en la petición.' });
    }

    const league = await League.findById(leagueId);

    if (!league) {
      console.log("League not found.");
      return res.status(404).json({ message: 'El torneo no existe' });
    }
    console.log("League found:", league);

    const user = await User.findOne({ discordId: discordId });
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log("User found:", user);

    const playerId = user._id;
    console.log("Player ID:", playerId);

    const matchesForPlayer = [];
    
    for (const round of league.rounds) {
      if (round.matches && round.matches.length > 0) {
        for (const match of round.matches) {
          if (
            match &&
            match.player1 &&
            match.player2 &&
            (match.player1.toString() === playerId.toString() ||
            match.player2.toString() === playerId.toString())
          ) {
            console.log("Match found for player:", match);
            matchesForPlayer.push({
              roundId: round._id,
              match
            });
          }
        }
      }
    }
    

    console.log("Matches for player:", matchesForPlayer);

    return res.json(matchesForPlayer);
  } catch (error) {
    console.log("An error occurred:", error);
    return res.status(500).json({ message: error.message });
  }
};
