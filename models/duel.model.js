// models/duel.model.js
import mongoose from 'mongoose';

const duelSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isFinished: {
    type: Boolean,
    default: false
  }
});

const Duel = mongoose.model('Duel', duelSchema);

export default Duel;
