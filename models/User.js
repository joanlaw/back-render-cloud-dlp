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
  avatar: {
    type: String,
  },
  puntos: {
    type: Number,
    default: 0,
  },
  // ...
}, { timestamps: true, collection: 'users' });

export default mongoose.model('User', userSchema);
