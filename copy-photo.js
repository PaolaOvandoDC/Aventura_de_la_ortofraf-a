const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Asus\\Downloads\\aplicaciones\\NADIA_OVANDO\\unnamedRUFFO.jpg';
const destDir = path.join(__dirname, 'public', 'images');
const dest = path.join(destDir, 'clase.jpg');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('✅ Foto copiada a: ' + dest);
