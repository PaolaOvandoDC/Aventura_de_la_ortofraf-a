const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    
    // Add days remaining for each task
    const now = new Date();
    const tasksWithCountdown = tasks.map(t => {
      const days = Math.ceil((new Date(t.dueDate) - now) / (1000 * 60 * 60 * 24));
      return { ...t.toObject(), daysLeft: days };
    });

    res.render('tareas', {
      title: 'Rincón de Tareas | La Aventura de la Ortografía',
      tasks: tasksWithCountdown,
      pageAccent: 'yellow'
    });
  } catch (err) {
    console.error(err);
    res.render('tareas', { 
      title: 'Rincón de Tareas',
      tasks: [],
      pageAccent: 'yellow'
    });
  }
});

module.exports = router;
