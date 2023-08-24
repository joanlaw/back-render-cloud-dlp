import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom', // Reemplaza 'ChatRoom' con el nombre del modelo de tus salas de chat
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reemplaza 'User' con el nombre del modelo de usuarios
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
