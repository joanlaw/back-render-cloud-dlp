import mongoose from 'mongoose'; // Importa mongoose
import League from '../models/league.model.js';
import User from '../models/User.js'

// METODO GET
export const getLeagues = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
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
export const createLeague = async (req, res) => {
  try {
    const { league_name, league_format, start_date, enlace_torneo, image_torneo, infoTorneo } = req.body;
    
    const league = new League({
      league_name,
      league_format,
      start_date: new Date(start_date),
      enlace_torneo,
      image_torneo,
      infoTorneo,
      organizer: req.userId  // Aquí guardamos el ID del usuario que creó el torneo
    });

    await league.save();
    res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// METODO PUT
export const updateLeague = async (req, res) => {
  try {
    const { league_name, league_format, start_date, enlace_torneo, image_torneo, infoTorneo } = req.body;

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


// Iniciar el torneo y crear emparejamientos para la primera ronda
export const startTournament = async (req, res) => {
  try {
    const { leagueId } = req.params;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }
    
    // Cambiar el estado del torneo a 'in_progress'
    league.status = 'in_progress';
    
    // Crear emparejamientos para la primera ronda
    const players = league.players;
    const matches = [];
    for (let i = 0; i < players.length; i += 2) {
      matches.push({ player1: players[i], player2: players[i + 1], winner: null });
    }
    
    league.matches = matches;
    await league.save();

    return res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Registrar el resultado de un emparejamiento
export const recordMatchResult = async (req, res) => {
  try {
    const { leagueId, matchId, winnerId } = req.params; // O puedes obtener estos datos del cuerpo de la solicitud (req.body)

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    const match = league.matches.id(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Emparejamiento no encontrado' });
    }
    
    // Actualizar el campo `winner` del emparejamiento correspondiente
    match.winner = winnerId;

    // Aquí podrías agregar la lógica para crear emparejamientos para la siguiente ronda
    // o para cambiar el estado del torneo a 'finished' y asignar puntos a los jugadores

    await league.save();
    
    return res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

