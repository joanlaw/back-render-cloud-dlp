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
        url_extra: String
    },
    extra_deck: {
        url: String
    },
    side_deck: {
        url: String
    },
    especial_deck: {
        url: String
    }
});

const PlayerDeck = mongoose.model('PlayerDeck', playerDeckSchema);

export default PlayerDeck;