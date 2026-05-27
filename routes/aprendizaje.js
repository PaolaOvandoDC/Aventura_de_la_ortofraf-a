const express = require('express');
const router = express.Router();
const LearningPost = require('../models/LearningPost');
const WeeklyChallenge = require('../models/WeeklyChallenge');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category && category !== 'Todos') filter.category = category;

    const posts = await LearningPost.find(filter).sort({ createdAt: -1 });
    const challenge = await WeeklyChallenge.findOne({ active: true }).sort({ createdAt: -1 });

    res.render('aprendizaje', {
      title: 'Espacio de Aprendizaje | La Aventura de la Ortografía',
      posts,
      challenge,
      activeCategory: category || 'Todos',
      pageAccent: 'green'
    });
  } catch (err) {
    console.error(err);
    res.render('aprendizaje', { 
      title: 'Espacio de Aprendizaje',
      posts: [], 
      challenge: null,
      activeCategory: 'Todos',
      pageAccent: 'green'
    });
  }
});

module.exports = router;
