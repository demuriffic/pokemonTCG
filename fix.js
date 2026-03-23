import fs from 'fs';
fs.writeFileSync('src/index.css', `@import "tailwindcss";\nbody { background-color: #f3f4f6; }\n`, 'utf8');
fs.writeFileSync('src/App.css', '', 'utf8');
fs.writeFileSync('src/main.jsx', fs.readFileSync('src/main.jsx', 'utf8').toString().replace(/^\uFEFF/, ''), 'utf8');
