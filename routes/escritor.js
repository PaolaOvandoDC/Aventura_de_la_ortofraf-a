const express = require('express');
const router = express.Router();
const StudentWork = require('../models/StudentWork');

router.get('/', async (req, res) => {
  try {
    const works = await StudentWork.find().sort({ createdAt: -1 });
    res.render('escritor', {
      title: 'El Rincón del Escritor | La Aventura de la Ortografía',
      works,
      pageAccent: 'lavender'
    });
  } catch (err) {
    console.error(err);
    res.render('escritor', { 
      title: 'El Rincón del Escritor',
      works: [],
      pageAccent: 'lavender'
    });
  }
});

// Like endpoint
router.post('/:id/like', async (req, res) => {
  try {
    const work = await StudentWork.findByIdAndUpdate(
      req.params.id, 
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ likes: work.likes });
  } catch (err) {
    res.status(500).json({ error: 'Error al dar like' });
  }
});

module.exports = router;
