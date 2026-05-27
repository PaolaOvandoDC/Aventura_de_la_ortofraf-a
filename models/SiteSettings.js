const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  heroPhotoUrl: { type: String, default: '' },
  heroPhotoAlt: { type: String, default: 'Estudiantes de Quinto de Primaria - Escuela RUFFO' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
