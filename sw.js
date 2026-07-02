const CACHE = 'cony-v3';
const SHELL = [
  './manifest.json',
  './icons/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // 외부 리소스 (Toss SDK 등): 네트워크 우선
  if (!e.request.url.startsWith(self.location.origin)) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }
  // 페이지 내비게이션: 네트워크 우선 → 앱 업데이트 즉시 반영 (GitHub Pages 하위경로 /cony/ 포함)
  const url = new URL(e.request.url);
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request).then(c => c || new Response('오프라인 상태입니다.', {status: 503})))
    );
    return;
  }
  // 기타 정적 자산: 캐시 우선
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
