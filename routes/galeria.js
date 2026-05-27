const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category && category !== 'Todos') filter.category = category;

    // "Este mes" filter
    if (category === 'Este mes') {
      const now = new Date();
      filter = {
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      };
    }

    const photos = await Photo.find(filter).sort({ date: -1 });
    res.render('galeria', {
      title: 'Galería de Recuerdos | La Aventura de la Ortografía',
      photos,
      activeCategory: category || 'Todos',
      pageAccent: 'coral'
    });
  } catch (err) {
    console.error(err);
    res.render('galeria', { 
      title: 'Galería de Recuerdos',
      photos: [], 
      activeCategory: 'Todos',
      pageAccent: 'coral'
    });
  }
});

module.exports = router;
