const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  // URL principal (primera imagen)
  imageUrl:    { type: String, default: '' },
  // Hasta 5 imágenes adicionales para el mini-carrusel
  images:      [{ type: String }],
  date:        { type: Date, default: Date.now },
  category:    { type: String, default: 'Actividades', enum: ['Todos','Este mes','Actividades','Eventos','Otros'] },
  description: { type: String, default: '' },
}, { timestamps: true });

// Helper: todas las imágenes del album (imageUrl + images)
photoSchema.virtual('allImages').get(function () {
  const all = [];
  if (this.imageUrl) all.push(this.imageUrl);
  (this.images || []).forEach(img => { if (img && !all.includes(img)) all.push(img); });
  return all;
});

photoSchema.set('toObject', { virtuals: true });
photoSchema.set('toJSON',   { virtuals: true });

module.exports = mongoose.model('Photo', photoSchema);
