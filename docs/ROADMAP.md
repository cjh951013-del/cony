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
1. ✅ **뜨개 진행 체크 공간** (커밋 64c9ebe): 🧶 뜨면서 체크 모달 — 단 하이라이트(노랑)·완료 단(초록)·단/코 카운터(자동 단 넘김)·진행률·단별 뜨는 순서 서술·차트 클릭 이동·문서별 저장
2. ✅ **원형 도안 생성기** (커밋 6f126b7): ⊚ 단별 기호·개수·반지름·회전 + 단 추가/삭제 + 실시간 미리보기 + 앵커 중심 일괄 배치
3. ✅ 방안뜨기 뜨기 방식 선택 (커밋 253f118): 짧은/긴/한길긴/두길긴 — 칸당 코수·기둥코·서술도안·트래커 연동
4. ✅ 픽셀 도구 보강 (커밋 2ca603e): 그리기·지우개·채우기(BFS)·스포이드 + 좌우/상하 대칭 — 방안뜨기 설정 패널
5. ✅ 이미지→픽셀 변환 (방안뜨기 설정 🖼 버튼): 격자 칸수로 축소 샘플링 + median-cut 색 양자화(2~16색) + 밝은 배경 제거(휘도>230→빈 칸, 핀피노 규약 동일) + 미리보기 → graphData 적용. 회전은 기존 캔버스 회전으로 대체, 블러는 축소 평균이 대신함.
6. SVG/PDF 내보내기·인쇄, 정렬 6종+균등분산, 미니맵·가이드라인
   - ✅ 정렬 6종 (커밋 예정): 플로팅(이동·붙여넣기·모티브) 정렬 바 — 좌/가로중앙/우/상/세로중앙/하, 중심이 프레임 안이면 프레임 기준 자동 전환, ✓완료·✕취소 버튼(터치 커밋 개선). 균등분산은 단일 플로팅 구조라 대상 없음 — 다중 객체 도입 시 재검토.
   - ✅ 미니맵: 확대 중 좌하단 자동 표시, 클릭·드래그 뷰 이동, 80ms 스로틀
   - ✅ SVG 내보내기: 기호 변환 모달 "↓ SVG (벡터)" — symChartSVG()가 renderSymChart와 동일 수식으로 완전 벡터 생성(래스터 캔버스에서 유일한 벡터 산출물, 레이아웃 수정 시 두 함수 동기 유지). 캔버스 그림 자체의 SVG화는 래스터라 불가 — PNG/PDF로 커버.
   - ✅ 가이드라인: 도구·가이드 패널 "안내선" — ＋가로/＋세로(중앙 삽입), ✋이동 모드(드래그, 그리기 잠금, px 라벨), 지움. 문서별 저장/복원(guides). → 6번 완료, PDF 인쇄·PNG/JPG·정렬·미니맵·SVG 모두 확보
7. ✅ 템플릿 카테고리화(기본/모티브/가방/의류/소품): 새 도안 모달에 카테고리 선택, 대시보드에 필터 칩(카테고리가 섞여 있을 때만 표시 — 도안 1~2개짜리엔 잡음이라 숨김), 카드 좌상단 배지. 샘플 5종 자동 분류(필레·도일리=모티브, 타원 바닥=가방, 가디건=의류).
8. 기호 팔레트 확충 — 와디즈 4배치 총 69종 추가(자세한 목록·잔여 항목은 docs/WADIZ-SYMBOLS.md). 핀피노의 늘리기·모아뜨기·구슬뜨기·셸 계열은 파라메트릭 시스템으로 커버. 남은 건 "코 아래에서" 변형(실제 이미지 재확인 필요)과 대바늘 확충뿐 — 사실상 완료.

**→ 1~8번 전 항목 완료 (2026-07-15).** 클라이언트 단에서 자동으로 진행 가능한 로드맵 작업은 여기까지. 이후 항목은 아래 "백엔드 필요"(사용자 결정)와 "사용자가 직접 해야 할 것"(계정·키·실기기 빌드)만 남음.

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
