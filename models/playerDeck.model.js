// playerDeck.model.js
import mongoose from 'mongoose';

const playerDeckSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    main_deck: {
        url: String,
    },
    extra_deck: {
        url: String
    },
    side_deck: {
        url: String
    },
    especial_deck: {
        url: String
    },
    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true
      },
});

const PlayerDeck = mongoose.model('PlayerDeck', playerDeckSchema);

export default PlayerDeck;