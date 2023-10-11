import mongoose from 'mongoose';

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
  clanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clan',
    default: null,
  },
  hasCreatedClan: {
    type: Boolean,
    default: false,
  },
  ID_DL: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{3}/.test(v); // Validador para el formato 862-858-906
      },
      message: props => `${props.value} no es un ID_DL válido!`
    },
    required: [true, 'El ID_DL es requerido']
  }  
}, { timestamps: true, collection: 'users' }); // Aquí especificas el nombre de la colección

export default mongoose.model('User', userSchema);
