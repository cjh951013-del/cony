/* 번역 안 된 UI 문자열에 data-i18n 키를 붙인다. 271곳을 손으로 붙이면 반드시 실수가 나온다.
   키는 한국어 원문의 해시라서 (1) 실행할 때마다 같고 (2) 같은 문장은 자동으로 같은 키를 쓴다
   — "취소"가 10곳에 있어도 번역은 한 번만 쓰면 된다.
   T()가 사전에 없는 키는 한국어로 떨어뜨리므로, 태그만 붙인 시점에는 화면이 그대로다.
   사용: node tools/i18n-tag.js [--dry] */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'index.html');
const dry = process.argv.includes('--dry');
let src = fs.readFileSync(FILE, 'utf8');

const hasKo = s => /[가-힣]/.test(s);
// 짧고 안정적인 키. 원문이 같으면 키도 같다.
const keyOf = s => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return 'x.' + h.toString(36);
};

// <script>/<style> 구간은 건드리면 안 된다. 위치를 미리 표시해 두고 그 밖에서만 치환한다.
const blocked = [];
for (const m of src.matchAll(/<(script|style)[\s\S]*?<\/\1>/g)) blocked.push([m.index, m.index + m[0].length]);
const inBlocked = i => blocked.some(([a, b]) => i >= a && i < b);

const found = new Map(); // key -> 한국어 원문
let textN = 0, attrN = 0;

// 1) 여는 태그 + 텍스트 + 닫는 태그 (자식 엘리먼트가 없는 것만)
src = src.replace(/<([a-z][a-z0-9]*)\b([^>]*)>([^<>]+)<\/\1>/gi, (whole, tag, attrs, text, off) => {
  if (inBlocked(off)) return whole;
  const t = text.trim();
  if (!t || !hasKo(t)) return whole;
  if (/data-i18n=/.test(attrs)) return whole;
  const k = keyOf(t);
  found.set(k, t); textN++;
  return `<${tag}${attrs} data-i18n="${k}">${text}</${tag}>`;
});

// 2) title / placeholder → data-i18n-t / data-i18n-p (기존 규약 그대로)
src = src.replace(/\s(title|placeholder)="([^"]*)"/g, (whole, name, val, off) => {
  if (inBlocked(off)) return whole;
  if (!hasKo(val)) return whole;
  const suffix = name === 'title' ? 't' : 'p';
  // 같은 태그에 이미 붙어 있으면 건너뛴다 — 앞쪽 200자만 봐도 충분하다
  const near = src.slice(Math.max(0, off - 200), off + 200);
  if (near.includes(`data-i18n-${suffix}=`)) return whole;
  const k = keyOf(val);
  found.set(k, val); attrN++;
  return `${whole} data-i18n-${suffix}="${k}"`;
});

console.log(`텍스트 ${textN}곳, 속성 ${attrN}곳에 키를 붙였습니다 (고유 문자열 ${found.size}개)`);

if (dry) { console.log('--dry: 파일을 쓰지 않았습니다.'); }
else {
  fs.writeFileSync(FILE, src);
  // 번역할 목록을 뽑아 둔다 — 사전 채울 때 이 파일만 보면 된다.
  const out = {};
  [...found.entries()].sort((a, b) => a[1].localeCompare(b[1])).forEach(([k, v]) => { out[k] = v; });
  fs.writeFileSync(path.join(ROOT, 'docs', 'i18n-todo.json'), JSON.stringify(out, null, 1));
  console.log('docs/i18n-todo.json 에 원문 목록을 남겼습니다.');
}
