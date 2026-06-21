# CONY (코니) — 뜨개 도안 제작 앱

단일 파일 웹앱: **`index.html`** (~1600줄, 순수 HTML/CSS/JS, 래스터 캔버스).
코니(CONY) = 아내가 만드는 코바늘 멘탈헬스 브랜드 + 남편(cjh95)이 만드는 앱 결합. 목표: 웹·Android·iOS·**와디즈 펀딩** 전부 출시. 슬로건 **"멈춰도 돼, 포기만 안 하면"**. 핵심 약속: 똥손도 쉽게, *"물어볼 사람 없어도 막히지 않게"*.

> 핸드폰에서 이어 작업: 이 저장소를 GitHub에 두고 claude.ai/code(웹) 또는 클로드 앱으로 접속. 이 문서가 맥락 인수인계용이니 **새 세션은 이 파일을 먼저 읽을 것.**

## 실행 / 미리보기
- 단일 정적 파일. 브라우저로 `index.html` 직접 열거나:
- `npx serve . -l 3940` → `http://localhost:3940`
- 폰 테스트(같은 와이파이): `http://<PC-IP>:3940`
- 배포(폰 미리보기용): GitHub Pages 또는 Netlify(정적 1파일이라 그대로 호스팅).

## 아키텍처
- 화면: 대시보드(`#screen-dash`) + 에디터(`#screen-ed`).
- 캔버스 3겹: `bg-c`(격자·프레임·앵커 마커), `main-c`(실제 그림 = 래스터 비트맵 1200×1200), `prev-c`(미리보기·편집핸들 오버레이, `pointer-events:none`).
- 전역 상태 객체 `G`: mode, stitch, color, rot, zoom, pan, gridOn, anchor, shape, editing, path 등.
- 좌표 변환 `getPos(e)`(zoom 반영, getBoundingClientRect 기준 → 캔버스 CSS크기=비트맵1200이라 정확). 표준 기호 렌더 `drawSVGStitch(ctx,x,y,id,color,size,rot)`.
- **`fitToScreen()`(중요)**: 1200×1200 전체를 `#cw` 뷰포트에 맞춰 zoom+center. openP/showScreen/중앙버튼/리사이즈·회전에서 호출. **폰에서 필수**(예전엔 100%라 좌상단만 보였음).

## 구현된 핵심 시스템
- **드로잉 엔진(프로크리에이트식)**: draw/stamp = 경로기록 → prev 미리보기 → 손뗄 때 커밋. 길게누르기(HOLD)/Shift/두번째 손가락 = 스냅 트리거.
- **QuickShape**: `detectShape`(직선/곡선/원·타원/사각/삼각, PCA로 회전 인식) → 편집 핸들 → `#shape-bar`. stamp는 코수 고정·자간 가변. **트리거 3종(전부 `enterSnap()` 동일)**: ①선 긋고 **2초 가만히**(HOLD_MS=2000, armHold 타이머) ②**다른 손가락 터치**(onDown 2터치 즉시) ③웹 **Shift**(keydown). `더보기▸길게 눌러 도형 고정` 토글(`G.quickShape`, off=2초자동만 끔, Shift/두손가락은 유지). 2초/명시 트리거라 신뢰도게이트 없음(예전 shapeFit 제거). **`#shape-bar`는 프로크리에이트식 미니 알약**(도형명 탭=다른모양⇄ · ✓ · ✕, 코수 ±는 stamp만, `.sb-name/.sb-ic`).
- **멀티터치**: 두 손가락 드래그=팬, 핀치=줌, 두 손가락 탭=undo, 세 손가락 탭=redo, **네 손가락 탭=UI 숨기기(`toggleUIHidden`, `body.ui-hidden`+`#ui-restore`)**.
- **기준점(앵커)+격자 스냅**: 도구패널 '◎ 기준점 잡기'로 앵커 지정, gridOn이면 핸들·스탬프가 앵커 격자에 스냅(방안뜨기 기초). `snapToGrid`/`setAnchor`/`drawAnchor`.
- 라이트/다크 모드(더보기 ⋯ 메뉴, `html[data-theme=light]`), 모바일 반응형(`@media≤640px` 세로 스택), 패널 접기(좌/우), 실 DB·AI·단수카운터 제거.
- **프로크리에이트식 UI v3(완료, main 병합 2026-06-22)**: 폰/태블릿/데스크탑 통일·풀블리드. 실제 프로크리에이트 크롬 재현.
  - **상단 바**(`#eh`, 반투명 오버레이): 좌클러스터 갤러리(`btn-back`)/동작🔧(`btn-more`→`#morepop`)/가이드🪄(`btn-adjust`→`#sr` 도구탭)/선택⬚(`btn-sel-top`)/변형⤢(`btn-trans`), 우클러스터 펜·기호✏️(`btn-paint`→`#sl` 팔레트)/지우개🩹(`btn-erase`)/레이어▦(`btn-layers`→`#sr` 레이어탭)/색상(`topcol`→`#colpop`). 활성 도구는 `setMode`가 버튼 `.act` 동기화. 버튼은 `.pc-tb`.
  - **좌측 슬라이더 사이드바**(`#tooldock`, 프로크리에이트 시그니처): 세로 크기슬라이더(`#size-rail`, 모드별 max 30/60)+스포이드 사각(`btn-modify`→pick)+세로 불투명도(`#op-rail`→`G.opacity`, strokePolyCtx/stampPolyCtx 적용)+실행취소/다시실행(`btn-undo/redo`).
  - **팝오버 패널**: `#sl`(팔레트, 상단에 기호/펜/방안/글자 모드탭 `.pc-modes`)·`#sr`(도구·가이드 / 레이어 탭) 떠있는 팝오버로 통일, 한 번에 하나만(`togglePanel`/`closePanels`/`showSrTab` — bindAll 내부 클로저), ✕/바깥탭(캔버스) 닫힘. `btn-adjust`↔`btn-layers`는 같은 `#sr` 탭 전환.
  - 첫 진입시 제스처 힌트 토스트(`#gesture-hint`, `G.hintShown`).

## 커스텀 기호(자작) 시스템 — 완료, main 병합됨
- `G.userSymbols` = 자작 글리프 배열. 글리프 = 정규화 셀(좌표 -1..1=±h) 안의 요소들: `{t:'line',pts:[[x,y]..]}`/`{t:'dot',x,y,r}`/`{t:'circ',x,y,r}`/`{t:'sym',id,x,y,s}`(기존기호 삽입=조합). 내부가 몇 개든 한 칸(size)로 정규화.
- `drawCustomGlyph()` 렌더 + `drawSVGStitch`가 `cus_*` id를 위임(자기참조 가드). `addCustomSymbol/deleteCustomSymbol/persistUserSymbols/loadUserSymbols`(localStorage `cony_usersymbols_v1`, init에서 로드).
- 팔레트(#stitch-list)에 표준 뒤로 `.sc.cus` 표시(탭=스탬프 선택, 길게=삭제). 편집기 모달 `#m-sym`(좌하단 ‘＋ 내 기호 만들기’): 정규화 캔버스에 선(폴리라인+✓선완료)·점·원·기호삽입(표준22종 조합) 탭으로 그림, 되돌리기/비우기/저장. `openSymEditor/drawSymEditor/symCanvasTap/bindSymEditor`.

## 프로크리에이트 패리티(P1~P5) — 완료, main 병합 (2026-06-21)
사용자 요청: "완전히 프로크리에이트처럼, 기존 PS 유저도 위화감 없이 + 새 기능". 기존 기능 다 가져오는 방향.
- **P1 진짜 레이어**(1d3183f): 각 레이어=별도 오프스크린 캔버스(`l.cv/l.ctx`), `mainCtx`=활성 레이어 포인터(그리기 코드 그대로), `main-c`=`dispCtx` 표시전용, `composite()`가 가시성·투명도·순서 합성. **레이어 인식 글로벌 undo**(히스토리 항목 `{lid,data}`, `prevDataFor`로 해당 레이어 직전 스냅샷 복원). 패널: 썸네일·이름·투명도%·👁토글·선택, 활성레이어에 투명도 슬라이더+⬆⬇순서+🔻병합+🗑삭제. `composite()`는 모든 커밋/지우개·방안 라이브/링/텍스트/선택 리프트·붙이기·삭제/undo·redo/clear/restore에 연결.
- **P2 스포이드**(0b0e63f): 도크 💧, `pickColorAt`=위 레이어부터 첫 불투명 픽셀색(없으면 배경), 추출 후 직전 모드 복귀(`G.prevMode`).
- **P3 대칭 가이드**(a36637e): `G.symmetry`(v/h/quad/radial N), `symXf()` 변환목록을 strokePolyCtx·stampPolyCtx·stampShape·stampAt·fillCell에 적용(그리기·스탬프·도형·방안 전부 미러, 프리뷰 포함). 앵커 기준 대칭축 점선 가이드.
- **P4 컬러 휠**(156bb06): 색상 팝오버에 HSB 디스크(각=색상,반경=채도)+명도 슬라이더+선택마커, `hsv2rgb/rgb2hsv`. **색 히스토리**(`G.colorHist`, 커밋시 누적·중복제거·최대10, 클릭 재선택).
- **P5 캔버스 액션**(6b30be4): ⋯메뉴 좌우/상하 반전(전 레이어), 활성 레이어 지우기, 전체 초기화. **멀티레이어 히스토리**(`saveHMulti`→`{multi:[...]}`, undo/redo가 단일·멀티 항목 모두 처리). 캔버스 반전 undo로 전 레이어 복원.
- **레이어 영속화(완료)**: 프로젝트별 `cony_layers_<id>` 키에 레이어 PNG+이름·가시성·투명도·blend 저장(`serializeLayers/persistLayers/restoreLayers`), 재오픈시 복원(쿼터초과 안전폐기, 없으면 평탄화 폴백). delP시 키 삭제.
- **블렌드 모드(완료)**: 레이어별 `l.blend`(보통/곱하기/스크린/오버레이/어둡게/밝게/닷지/반전차)를 composite()의 globalCompositeOperation으로 적용, 패널 셀렉트. **레이어 이름변경**(✎). 둘다 영속.
- **알파 잠금(완료, 🔓/🔒)**: `l.alphaLock`→레이어 ctx `globalCompositeOperation='source-atop'`(`applyLayerLock`, ensure/restore시 적용). 기존 불투명 픽셀 위에만 그려짐. **클리핑 마스크(완료, ⤓)**: `l.clip`→composite()에서 바로 아래 레이어 알파로 마스킹(temp 캔버스 destination-in, `_clipTmp` 재사용). 둘다 영속. ★레이어 시스템 완전체.
- **내보내기(완료)**: PNG/JPG=합성+CONY 워터마크. **PDF=브라우저 인쇄 시트**(`exportPrintable`→#print-area: 제목+차트+자동범례+슬로건, `@media print`, 오프라인·모바일 OK, window.print).
- **이미지 가져오기(완료)**: ⋯메뉴 🖼 → 사진을 새 반투명(0.6) 레이어에 contain 맞춤 배치 → 따라 그려 차트화(`importImageFromURL`/`importImageFile`, #img-input).
- **셀렉션 강화(완료)**: 선택 모양 토글 #sel-shape(▭사각/⬭타원/✎올가미, select·area 모드시 표시). 비사각은 `applySelMask`(destination-in)로 리프트·복사 마스킹 + `clearSelectionRegion`(clip)로 레이어 해당모양만 제거. `G.selMode/selPath`, lasso는 자유경로 기록, selRect가 lasso bbox 처리.

## 최근 완료(main 병합) — 2026-06-21 세션
- **코·단 번호매기기**(`G.numbersOn` 토글, `drawNumbers`, 좌하단=1). **표준기호 +10**(코바늘: fpdc/bpdc/cl/puff/shell/spike, 대바늘: p2tog/m1/rc/lc; `stitchOrder`는 배열길이서 동적). **범례 자동**(`recordSymUse`로 스탬프시 기록→`openLegend` 모달, ⋯메뉴). **방사 배치**(`G.radial` 토글=앵커 향해 자동회전 스탬프, `placeRing`=원형 N개; 가이드섹션 개수/반지름). **방안뜨기 모드**(도크 ▦, `fillCell`=40px 격자칸 색칠; onDown/Move/Up graph 분기).

## 다음 작업 (우선순위)
1. **다중 프레임 자유배치**(#10, Pro) / **'패턴 생성' 칸**(#11). **주석 레이어**(#18, 가이드·화살표·치수).
2. **색상모델 정리**(#14: 배경색 축소, Pro=기호별 프리셋색). #4 손잠금모드, #6 도구위치(거의 됨). 요금제 게이팅(Free/Pro 4,900·39,000평생).
3. 네이티브 패키징(Capacitor)로 Android/iOS, 와디즈 펀딩 준비.
- ⚠️**단수표 자동(#16)은 래스터 캔버스라 비트맵서 행별 코수 역산 불가** → 자동 불가. 정직하게: 범례(자동) 제공함. 진짜 단수표 원하면 사용자 입력식 표 or 구조화(벡터)재설계 필요.
- (완료) ~~커스텀 기호 편집기~~ / ~~프로크리에이트 UI~~ / ~~선택·영역 변형~~ / ~~번호매기기~~ / ~~표준기호 확장~~ / ~~범례~~ / ~~방사배치~~ / ~~방안뜨기 모드~~.
5. **단수표 자동·범례 자동·주석 레이어**(가이드·화살표·치수). 목표 품질 레퍼런스: 인스타 knittermall '도로시 미니 숄더백' 도안.
6. 도안 크기 옵션(Pro 무제한), **자동저장(localStorage)**, 코·단 번호매기기(좌하단=1→우·상).
7. 네이티브 패키징(Capacitor)으로 Android/iOS 출시.

## 제약
- **에러 0** (전 플랫폼 출시 예정). 변경은 작게, 매번 검증.
- 요금제: Free / **Pro 4,900원/월 or 39,000원 평생** (Pro+ 폐기).
- **브러쉬 저작권**: 표준 뜨개 기호는 산업표준이라 자작 OK. **와디즈 유료 브러쉬팩 복제 금지**.

## 검증 팁
- 스크린샷 툴이 자주 타임아웃 → DOM eval로 검증(`getImageData` 잉크 픽셀수, `getComputedStyle` 등).
- 리로드 직후 첫 캔버스 연산이 0으로 나올 수 있음(타이밍) → 워밍업 후 재측정.
