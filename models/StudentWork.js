const mongoose = require('mongoose');

const studentWorkSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StudentWork', studentWorkSchema);
