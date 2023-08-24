import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

export default ChatRoom;