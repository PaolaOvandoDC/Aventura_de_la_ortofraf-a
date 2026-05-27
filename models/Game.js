const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: Number, min: 1, max: 5, default: 3 },
  type: { 
    type: String, 
    enum: ['builtin-error', 'builtin-complete', 'external'], 
    default: 'external' 
  },
  externalUrl: { type: String, default: '' },
  imageEmoji: { type: String, default: '🎮' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
