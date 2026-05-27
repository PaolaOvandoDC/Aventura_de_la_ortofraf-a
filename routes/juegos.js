const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ active: true }).sort({ createdAt: -1 });
    res.render('juegos', {
      title: 'Juegos Educativos | La Aventura de la Ortografía',
      games,
      pageAccent: 'mint'
    });
  } catch (err) {
    console.error(err);
    res.render('juegos', { 
      title: 'Juegos Educativos',
      games: [],
      pageAccent: 'mint'
    });
  }
});

module.exports = router;
