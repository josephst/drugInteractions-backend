import mongoose = require('mongoose');
mongoose.Promise = global.Promise;

export const drugInteractionSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  targetId: {
    required: true,
    type: String,
  },
  targetName: {
    required: true,
    type: String,
  },
}, {
  bufferCommands: false,
});
