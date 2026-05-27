const mongoose = require('mongoose');

const learningPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Reglas', 'Trucos', 'Actividades', 'Desafíos'], 
    default: 'Reglas' 
  },
  emoji: { type: String, default: '📖' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LearningPost', learningPostSchema);
