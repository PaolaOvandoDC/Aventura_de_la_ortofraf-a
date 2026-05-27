const mongoose = require('mongoose');

const lessonPostSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { 
    type: String, 
    enum: ['Lectura', 'Escritura', 'Ortografía', 'Expresión', 'Otros'], 
    default: 'Otros' 
  },
  imageUrl: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  isNewPost: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LessonPost', lessonPostSchema);
