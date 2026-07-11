# 남은 작업

## 핀피노 대응 로드맵 (2026-07-11, 핀피노 실기 탐색·렌더러 소스 실측으로 확정)

전략: 핀피노(월 9,800/연 89,000, 무료=디자인1개+워터마크)보다 저렴하게 공급, 웹·Android·iOS 완전 연동, "도안 제작"에 더해 "뜨면서 체크하는 진행 공간"까지 — 한 앱에서 전부 해결.

### 핀피노 방안뜨기 차트 스펙 (renderSymbolChart 실측 — 구현 시 이 수치 기준)
- 뜨기별 칸당 코수: 짧은뜨기 1(총=칸수, +1 없음) / 긴뜨기 2(총=칸×2+1, 빈칸 사슬 1개, 기둥코 사슬2) / 한길긴뜨기 3(총=칸×3+1, 빈칸 사슬 2개, 기둥코 사슬3) / 두길긴뜨기 3(칸폭 24로 확대, 기둥코 사슬3)
- 기둥코는 단 시작쪽 "경계 기둥 자리를 대체"(홀수단 오른쪽·짝수단 왼쪽) — 차트 밖 아님 ✅적용(3671333)
- 채운 칸 음영 = 해당 색 28% 틴트 ✅적용(3671333) / 밝기(luminance)>230 색은 배경 취급
- 단 번호 클릭=단 하이라이트(#FFD54F 35%, 주황 강조), 코 클릭=선택(파랑)+툴팁(N번째 코·기법·방향), localStorage 디자인별 저장 → 진행 체크 공간의 씨앗
- 정보 패널: 뜨기 방식/기둥코/방향(아래→위, 좌↔우 교대)/총코수(=칸수, 셀 기준)/색상별 코수

### 구현 순서 (클라이언트만으로 가능)
1. **뜨개 진행 체크 공간** (사용자 확정 요구): 도안 열람 전용 모드 + 단 하이라이트 + 코 카운터(현재 단·코 저장) + 색상별 남은 코수 — 핀피노보다 확장 (핀피노는 차트 안 클릭 마킹뿐)
2. **원형 도안 생성기**: 단별 기호 선택+개수+반지름+회전 슬라이더, 단 추가, 실시간 미리보기 (핀피노 모달 동일 UX)
3. 방안뜨기 뜨기 방식 선택(짧은/긴/한길긴/두길긴 — 위 스펙 수치로)
4. 픽셀 도구 보강: 채우기(F)·지우개·스포이드·좌우/상하 대칭 체크
5. 이미지→픽셀 변환(색수·블러·회전 조절)
6. SVG/PDF 내보내기·인쇄, 정렬 6종+균등분산, 미니맵·가이드라인
7. 템플릿 카테고리화(기본/모티브/가방/의류/소품)
8. 기호 팔레트 확충(핀피노 34종: 늘리기·모아뜨기·구슬뜨기·셸 계열) + 팔레트 설정

### 백엔드 필요 (별도 결정 — Supabase 등 BaaS)
- 계정(카카오/네이버/구글), 클라우드 디자인 저장+검색, 버전 히스토리, 갤러리(공유·좋아요·복제·정렬), 공유 링크·임베드

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
