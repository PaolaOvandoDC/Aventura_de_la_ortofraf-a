require('dotenv').config();

// Fix: Forzar DNS de Google para resolver MongoDB Atlas en Windows
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch(e) {}

const mongoose = require('mongoose');

console.log('🔍 Probando conexión a MongoDB Atlas...');
console.log('📡 URI:', process.env.MONGO_URI
  ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')
  : '❌ NO ENCONTRADA EN .env');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 12000,
})
.then(() => {
  console.log('');
  console.log('✅ ¡CONEXIÓN EXITOSA! MongoDB Atlas funciona correctamente.');
  console.log('🚀 Ya puedes correr: npm run dev');
  process.exit(0);
})
.catch(err => {
  console.log('');
  console.log('❌ FALLO:', err.message);
  console.log('');
  console.log('👉 Ve a cloud.mongodb.com → Network Access → Add IP → Allow Access From Anywhere');
  process.exit(1);
});
