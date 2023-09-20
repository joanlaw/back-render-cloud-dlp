import mongoose from 'mongoose';

const clanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logoUrl: {
    type: String,
  },
  logo: {
    url: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true, collection: 'clans' });

export default mongoose.model('Clan', clanSchema);
