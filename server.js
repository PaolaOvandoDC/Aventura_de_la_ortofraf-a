require('dotenv').config();

// Fix: Forzar DNS de Google para resolver MongoDB Atlas en Windows
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch(e) {}

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

// MongoDB Connection — non-fatal, servidor sigue corriendo aunque falle la DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    console.log('⚠️  El servidor sigue corriendo. Verifica tu IP en Network Access de Atlas.');
  }
};
connectDB();

// Evitar que el proceso muera por errores no atrapados
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Rejection:', err.message);
});
process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err.message);
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: false,
  lastModified: false
}));

// Session — fallback a memoria si no hay MongoDB todavía
let sessionStore;
try {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600
  });
} catch (e) {
  console.log('⚠️  Session store usando memoria (sin MongoDB)');
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'ruffo_secret_2024',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Hacer sesión disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.isAdmin = req.session ? req.session.isAdmin || false : false;
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/galeria', require('./routes/galeria'));
app.use('/juegos', require('./routes/juegos'));
app.use('/aprendemos', require('./routes/aprendemos'));
app.use('/tareas', require('./routes/tareas'));
app.use('/escritor', require('./routes/escritor'));
app.use('/aprendizaje', require('./routes/aprendizaje'));
app.use('/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('home', {
    title: 'Página no encontrada | La Aventura de la Ortografía',
    challenge: null,
    stats: { photoCount: 0, gameCount: 0, workCount: 0 },
    pageAccent: 'lavender'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
