const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage en Cloudinary — funciona tanto en localhost como en Render
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'aventura-ortografia',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
    public_id: `foto_${Date.now()}_${Math.round(Math.random() * 1e6)}`
  })
});

// Filtro de tipos
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Solo imágenes permitidas'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { upload, cloudinary };
