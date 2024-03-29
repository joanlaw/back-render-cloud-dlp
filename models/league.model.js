import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const leagueSchema = mongoose.Schema({
  league_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  league_format: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  reglas: {
    type: String,
    trim: true,
  },
  enlace_torneo: String,
  image: {
    url: String
  },
  infoTorneo: [
    {
      format: String,
      banlist: String,
      deck_info: String,
      eliminacion: String
    }
  ],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rounds: [{
    matches: [{
      matchNumber: Number,  // Nuevo campo
      fromMatch: Number,    // Nuevo campo para indicar desde qué match viene un jugador
      player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
      },      
      result: {
        type: String,
        default: ''
      },
      scores: {
        player1: Number,
        player2: Number
      },
      status: {  // Nuevo campo para el estado del match
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
      }
    }]
  }],
  current_round: {
    type: Number,
    default: 0
  },
  totalRounds: {
    type: Number,
    default: 0
  },
  playerDecks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlayerDeck'
  }],
  totalRounds: {  // Nuevo campo para el total de rondas
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'finalized'],
    default: 'open'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  discordId: String
});

// Aplicar el plugin de paginación al esquema
leagueSchema.plugin(mongoosePaginate);

const League = mongoose.model('League', leagueSchema);

export default League;