// index.html의 중복 id 검사 — 저장소 루트에서 `node tools/dupid.js`
const src = require('fs').readFileSync('index.html', 'utf8');
const ids = [...src.matchAll(/\sid="([\w-]+)"/g)].map(m => m[1]);
const seen = new Map();
ids.forEach(id => seen.set(id, (seen.get(id) || 0) + 1));
const dups = [...seen.entries()].filter(([, n]) => n > 1);
console.log('total ids:', ids.length, 'unique:', seen.size, 'duplicates:', dups.length);
dups.forEach(([id, n]) => console.log('  DUP:', id, 'x' + n));
process.exit(dups.length ? 1 : 0);
