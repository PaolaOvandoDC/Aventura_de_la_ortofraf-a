const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const Game = require('../models/Game');
const LessonPost = require('../models/LessonPost');
const Task = require('../models/Task');
const StudentWork = require('../models/StudentWork');
const LearningPost = require('../models/LearningPost');
const WeeklyChallenge = require('../models/WeeklyChallenge');

// Disable layout for ALL admin routes (they use standalone HTML)
router.use((req, res, next) => {
  res.locals.layout = false;
  next();
});

// Auth middleware
const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) return next();
  res.redirect('/admin/login');
};

// ── LOGIN ──────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', { 
      title: 'Admin Login', 
      error: 'Usuario o contraseña incorrectos' 
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── DASHBOARD ──────────────────────────────────────────────
router.get('/', isAdmin, async (req, res) => {
  try {
    const [photos, games, lessons, tasks, works, learnings, challenge] = await Promise.all([
      Photo.countDocuments(),
      Game.countDocuments(),
      LessonPost.countDocuments(),
      Task.countDocuments(),
      StudentWork.countDocuments(),
      LearningPost.countDocuments(),
      WeeklyChallenge.findOne({ active: true }).sort({ createdAt: -1 })
    ]);

    res.render('admin/dashboard', {
      title: 'Panel de Administración',
      stats: { photos, games, lessons, tasks, works, learnings },
      challenge,
      section: 'overview'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/login');
  }
});

// ── WEEKLY CHALLENGE ──────────────────────────────────────
router.post('/challenge', isAdmin, async (req, res) => {
  try {
    const { text, hint } = req.body;
    await WeeklyChallenge.updateMany({}, { active: false });
    await WeeklyChallenge.create({ text, hint, active: true });
    res.redirect('/admin?section=challenge&msg=saved');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// ── PHOTOS CRUD ────────────────────────────────────────────
router.get('/fotos', isAdmin, async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Fotos',
    stats: {}, challenge: null,
    section: 'fotos', photos
  });
});

router.post('/fotos', isAdmin, async (req, res) => {
  try {
    await Photo.create(req.body);
    res.redirect('/admin/fotos?msg=created');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/fotos');
  }
});

router.delete('/fotos/:id', isAdmin, async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.redirect('/admin/fotos?msg=deleted');
});

// ── GAMES CRUD ─────────────────────────────────────────────
router.get('/juegos', isAdmin, async (req, res) => {
  const games = await Game.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Juegos',
    stats: {}, challenge: null,
    section: 'juegos', games
  });
});

router.post('/juegos', isAdmin, async (req, res) => {
  try {
    await Game.create(req.body);
    res.redirect('/admin/juegos?msg=created');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/juegos');
  }
});

router.delete('/juegos/:id', isAdmin, async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.redirect('/admin/juegos?msg=deleted');
});

// ── LESSONS CRUD ───────────────────────────────────────────
router.get('/aprendemos', isAdmin, async (req, res) => {
  const lessons = await LessonPost.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Aprendemos Juntos',
    stats: {}, challenge: null,
    section: 'aprendemos', lessons
  });
});

router.post('/aprendemos', isAdmin, async (req, res) => {
  try {
    const data = { ...req.body, isNewPost: req.body.isNewPost === 'on' };
    await LessonPost.create(data);
    res.redirect('/admin/aprendemos?msg=created');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/aprendemos');
  }
});

router.delete('/aprendemos/:id', isAdmin, async (req, res) => {
  await LessonPost.findByIdAndDelete(req.params.id);
  res.redirect('/admin/aprendemos?msg=deleted');
});

// ── TASKS CRUD ─────────────────────────────────────────────
router.get('/tareas', isAdmin, async (req, res) => {
  const tasks = await Task.find().sort({ dueDate: 1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Tareas',
    stats: {}, challenge: null,
    section: 'tareas', tasks
  });
});

router.post('/tareas', isAdmin, async (req, res) => {
  try {
    await Task.create(req.body);
    res.redirect('/admin/tareas?msg=created');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/tareas');
  }
});

router.put('/tareas/:id', isAdmin, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/tareas?msg=updated');
  } catch (err) {
    res.redirect('/admin/tareas');
  }
});

router.delete('/tareas/:id', isAdmin, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/admin/tareas?msg=deleted');
});

// ── STUDENT WORKS CRUD ─────────────────────────────────────
router.get('/escritor', isAdmin, async (req, res) => {
  const works = await StudentWork.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Escritor',
    stats: {}, challenge: null,
    section: 'escritor', works
  });
});

router.post('/escritor', isAdmin, async (req, res) => {
  try {
    await StudentWork.create(req.body);
    res.redirect('/admin/escritor?msg=created');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/escritor');
  }
});

router.delete('/escritor/:id', isAdmin, async (req, res) => {
  await StudentWork.findByIdAndDelete(req.params.id);
  res.redirect('/admin/escritor?msg=deleted');
});

// ── LEARNING POSTS CRUD ────────────────────────────────────
router.get('/aprendizaje', isAdmin, async (req, res) => {
  const learnings = await LearningPost.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Aprendizaje',
    stats: {}, challenge: null,
    section: 'aprendizaje', learnings
  });
});

router.post('/aprendizaje', isAdmin, async (req, res) => {
  try {
    await LearningPost.create(req.body);
    res.redirect('/admin/aprendizaje?msg=created');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/aprendizaje');
  }
});

router.delete('/aprendizaje/:id', isAdmin, async (req, res) => {
  await LearningPost.findByIdAndDelete(req.params.id);
  res.redirect('/admin/aprendizaje?msg=deleted');
});

module.exports = router;
