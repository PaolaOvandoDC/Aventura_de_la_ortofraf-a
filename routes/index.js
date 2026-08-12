const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Game = require('../models/Game');
const StudentWork = require('../models/StudentWork');
const WeeklyChallenge = require('../models/WeeklyChallenge');
const SiteSettings = require('../models/SiteSettings');

router.get('/', async (req, res) => {
  // Serve cached static home if available (fast path for cold starts)
  try {
    const cached = path.join(__dirname, '..', 'public', 'cache', 'home_cached.html');
    if (fs.existsSync(cached)) return res.sendFile(cached);
  } catch (e) {
    // ignore and continue to dynamic render
  }
  try {
    const [challenge, photoCount, gameCount, workCount, settings] = await Promise.all([
      WeeklyChallenge.findOne({ active: true }).sort({ createdAt: -1 }),
      Photo.countDocuments(),
      Game.countDocuments({ active: true }),
      StudentWork.countDocuments(),
      SiteSettings.findOne().sort({ createdAt: -1 })
    ]);

    res.render('home', {
      title: 'Inicio | La Aventura de la Ortografía',
      challenge,
      stats: { photoCount, gameCount, workCount },
      heroPhotoUrl: settings && settings.heroPhotoUrl ? settings.heroPhotoUrl : '',
      pageAccent: 'lavender'
    });
  } catch (err) {
    console.error(err);
    res.render('home', {
      title: 'Inicio | La Aventura de la Ortografía',
      challenge: null,
      stats: { photoCount: 0, gameCount: 0, workCount: 0 },
      heroPhotoUrl: '',
      pageAccent: 'lavender'
    });
  }
});

module.exports = router;
