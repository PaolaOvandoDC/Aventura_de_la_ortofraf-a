const express = require('express');
const router = express.Router();
const LessonPost = require('../models/LessonPost');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category && category !== 'Todos') filter.category = category;

    const posts = await LessonPost.find(filter).sort({ date: -1 });
    const newPost = await LessonPost.findOne({ isNewPost: true }).sort({ createdAt: -1 });

    res.render('aprendemos', {
      title: 'Lo que Aprendemos Juntos | La Aventura de la Ortografía',
      posts,
      newPost,
      activeCategory: category || 'Todos',
      pageAccent: 'sky'
    });
  } catch (err) {
    console.error(err);
    res.render('aprendemos', { 
      title: 'Lo que Aprendemos Juntos',
      posts: [], 
      newPost: null,
      activeCategory: 'Todos',
      pageAccent: 'sky'
    });
  }
});

// Like endpoint
router.post('/:id/like', async (req, res) => {
  try {
    const post = await LessonPost.findByIdAndUpdate(
      req.params.id, 
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: 'Error al dar like' });
  }
});

module.exports = router;
