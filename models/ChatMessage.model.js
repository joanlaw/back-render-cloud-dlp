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
    }
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
