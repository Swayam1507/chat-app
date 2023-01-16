const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isGroupChat:{
    type: Boolean,
    default: false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);