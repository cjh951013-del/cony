// index.html의 모든 <script> 블록 문법 검증 — 저장소 루트에서 `node tools/syncheck.js`
const src = require('fs').readFileSync('index.html', 'utf8');
const blocks = [...src.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)];
console.log('script blocks:', blocks.length);
let ok = true;
blocks.forEach((m, i) => {
  try { new Function(m[1]); console.log(`block ${i}: OK (${m[1].length} chars)`); }
  catch (e) { ok = false; console.log(`block ${i}: FAIL — ${e.message}`); }
});
process.exit(ok ? 0 : 1);
