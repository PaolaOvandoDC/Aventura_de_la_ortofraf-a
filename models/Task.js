const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  subject: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['Pendiente', 'En proceso', 'Completada'], 
    default: 'Pendiente' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
