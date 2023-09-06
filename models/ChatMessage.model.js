import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    discordId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: { // Agrega la propiedad 'avatar' al esquema
      type: String, // Supongo que la URL del avatar es un String
      required: false,
    },
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
