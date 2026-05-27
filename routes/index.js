const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const Game = require('../models/Game');
const LessonPost = require('../models/LessonPost');
const Task = require('../models/Task');
const StudentWork = require('../models/StudentWork');
const WeeklyChallenge = require('../models/WeeklyChallenge');

router.get('/', async (req, res) => {
  try {
    const challenge = await WeeklyChallenge.findOne({ active: true }).sort({ createdAt: -1 });
    const photoCount = await Photo.countDocuments();
    const gameCount = await Game.countDocuments({ active: true });
    const workCount = await StudentWork.countDocuments();

    res.render('home', {
      title: 'Inicio | La Aventura de la Ortografía',
      challenge,
      stats: { photoCount, gameCount, workCount },
      pageAccent: 'lavender'
    });
  } catch (err) {
    console.error(err);
    res.render('home', { 
      title: 'Inicio | La Aventura de la Ortografía',
      challenge: null,
      stats: { photoCount: 0, gameCount: 0, workCount: 0 },
      pageAccent: 'lavender'
    });
  }
});

module.exports = router;
