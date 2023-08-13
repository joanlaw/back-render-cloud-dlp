const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  // Puedes agregar más campos según tus necesidades, como el avatar, correo electrónico, etc.
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
