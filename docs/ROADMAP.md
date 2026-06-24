# 남은 작업

## 코드 작업 (남음)
- Toss 실키 교체: `TOSS_CLIENT_KEY` (index.html 1363줄) + `TOSS_SECRET_KEY` (Netlify env var) 둘 다 실제 키로 교체
- Netlify 배포: `netlify deploy --prod` 또는 GitHub 연동 후 자동 배포
- Chrome Extension `WEB_URL` 교체: `chrome-ext/popup.js` 1번째 줄 → 실제 Netlify URL로 교체

## 사용자가 직접 해야 할 것

### 아이콘 생성 (전 플랫폼 공통 선행 작업)
- `icons/gen-icons.html` 브라우저에서 열어 다운로드:
  - `icon-512.png`, `icon-192.png` → `icons/` 폴더에 저장 (PWA + Capacitor)
  - `icon-128.png`, `icon-48.png`, `icon-16.png` → `chrome-ext/icons/` 폴더에 저장 (Chrome Extension)

### Android APK
- `npm install` → `npx cap add android` → `npx cap sync`
- Android Studio에서 `android/` 프로젝트 열기 → Build > Generate Signed APK
- Google Play Console에서 APK 업로드

### iOS
- Mac + Xcode 필요 (Windows에서 빌드 불가)
- `npm install` → `npx cap add ios` → `npx cap sync`
- Xcode에서 `ios/` 프로젝트 열기 → Archive → App Store Connect 업로드

### Chrome Extension
- `npm run ext:build` (chrome-ext/app/index.html 복사)
- Chrome 설정 → 확장 프로그램 → 개발자 모드 → `chrome-ext/` 폴더 로드
- 검증 후 Chrome Web Store 개발자 계정에서 게시

### 와디즈 펀딩
- `docs/wadiz-copy.md` 카피 복붙 → 스크린샷 5장 첨부

## 완료
- ✅ 기호별 회전 고정 (toolRots + rotLocked 잠금버튼 + 프리셋 45/90/135/-90°)
- ✅ Netlify Functions confirm-payment.js (서버사이드 Toss 확인)
- ✅ netlify.toml 설정
- ✅ successUrl Netlify 자동 감지 분기
- ✅ 와디즈 펀딩 카피 (docs/wadiz-copy.md)
- ✅ PWA manifest.json (id 필드 + scope 추가)
- ✅ sw.js 캐시 전략: index.html network-first (앱 업데이트 즉시 반영)
- ✅ package.json: @capacitor/splash-screen, @capacitor/status-bar 추가
- ✅ Chrome Extension scaffold (chrome-ext/ 폴더 + npm run ext:build)
- ✅ gen-icons.html: Chrome Extension용 16/48/128px 아이콘 생성 추가

## 영구 불가
- 단수표 자동 (#16): 래스터 비트맵이라 행별 코수 역산 불가
