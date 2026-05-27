const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const Game = require('../models/Game');
const LessonPost = require('../models/LessonPost');
const Task = require('../models/Task');
const StudentWork = require('../models/StudentWork');
const LearningPost = require('../models/LearningPost');
const WeeklyChallenge = require('../models/WeeklyChallenge');
const SiteSettings = require('../models/SiteSettings');
const upload = require('../middleware/upload');

// Disable layout for ALL admin routes
router.use((req, res, next) => {
  res.locals.layout = false;
  next();
});

// ── AUTH ───────────────────────────────────────────────────
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
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', { title: 'Admin Login', error: 'Usuario o contraseña incorrectos' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── DASHBOARD ──────────────────────────────────────────────
router.get('/', isAdmin, async (req, res) => {
  try {
    const [photos, games, lessons, tasks, works, learnings, challenge, settings] = await Promise.all([
      Photo.countDocuments(),
      Game.countDocuments(),
      LessonPost.countDocuments(),
      Task.countDocuments(),
      StudentWork.countDocuments(),
      LearningPost.countDocuments(),
      WeeklyChallenge.findOne({ active: true }).sort({ createdAt: -1 }),
      SiteSettings.findOne().sort({ createdAt: -1 })
    ]);
    res.render('admin/dashboard', {
      title: 'Panel de Administración',
      stats: { photos, games, lessons, tasks, works, learnings },
      challenge, settings,
      section: 'overview', msg: req.query.msg || ''
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
    res.redirect('/admin?msg=challenge_saved');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// ── HERO PHOTO (Foto del inicio) ──────────────────────────
router.post('/hero-photo', isAdmin, upload.single('heroPhoto'), async (req, res) => {
  try {
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.heroPhotoUrl;
    await SiteSettings.deleteMany({});
    await SiteSettings.create({ heroPhotoUrl: photoUrl });
    res.redirect('/admin?msg=photo_saved');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// ── PHOTOS CRUD ────────────────────────────────────────────
router.get('/fotos', isAdmin, async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', {
    title: 'Gestionar Fotos', stats: {}, challenge: null, settings: null,
    section: 'fotos', photos, msg: req.query.msg || ''
  });
});

router.post('/fotos', isAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    await Photo.create({
      title: req.body.title,
      imageUrl,
      date: req.body.date || Date.now(),
      category: req.body.category,
      description: req.body.description
    });
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
    title: 'Gestionar Juegos', stats: {}, challenge: null, settings: null,
    section: 'juegos', games, msg: req.query.msg || ''
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
    title: 'Gestionar Aprendemos', stats: {}, challenge: null, settings: null,
    section: 'aprendemos', lessons, msg: req.query.msg || ''
  });
});

router.post('/aprendemos', isAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    await LessonPost.create({
      ...req.body,
      imageUrl,
      isNewPost: req.body.isNewPost === 'on'
    });
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
    title: 'Gestionar Tareas', stats: {}, challenge: null, settings: null,
    section: 'tareas', tasks, msg: req.query.msg || ''
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
    title: 'Gestionar Escritor', stats: {}, challenge: null, settings: null,
    section: 'escritor', works, msg: req.query.msg || ''
  });
});

router.post('/escritor', isAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    await StudentWork.create({
      studentName: req.body.studentName,
      title: req.body.title,
      content: req.body.content,
      imageUrl
    });
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
    title: 'Gestionar Aprendizaje', stats: {}, challenge: null, settings: null,
    section: 'aprendizaje', learnings, msg: req.query.msg || ''
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
