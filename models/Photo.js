const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { 
    type: String, 
    enum: ['Actividades', 'Eventos', 'Otros'], 
    default: 'Actividades' 
  },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
