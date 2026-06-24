// 번들 앱 URL (chrome-ext/app/index.html 복사본)
const BUNDLE_URL = chrome.runtime.getURL('app/index.html');
// 웹 배포 URL — Netlify 배포 후 실제 URL로 교체
const WEB_URL = 'https://cony-app.netlify.app';

document.getElementById('btn-open').addEventListener('click', () => {
  chrome.tabs.create({ url: BUNDLE_URL });
  window.close();
});

document.getElementById('btn-web').addEventListener('click', () => {
  chrome.tabs.create({ url: WEB_URL });
  window.close();
});
