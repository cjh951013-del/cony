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
- 좌표 변환 `getPos(e)`(zoom 반영). 표준 기호 렌더 `drawSVGStitch(ctx,x,y,id,color,size,rot)`.

## 구현된 핵심 시스템
- **드로잉 엔진(프로크리에이트식)**: draw/stamp = 경로기록 → prev 미리보기 → 손뗄 때 커밋. 길게누르기(HOLD)/Shift/두번째 손가락 = 스냅 트리거.
- **QuickShape**: `detectShape`(직선/곡선/원·타원/사각/삼각, PCA로 회전 인식) → 편집 핸들(코너·중심·초록 회전) → `#shape-bar`(다른모양/완료/취소). stamp는 **코수 고정·자간 가변**(±코 버튼).
- **멀티터치**: 두 손가락 드래그=팬, 핀치=줌, 두 손가락 탭=undo, 세 손가락 탭=redo.
- **기준점(앵커)+격자 스냅**: 도구패널 '◎ 기준점 잡기'로 앵커 지정, gridOn이면 핸들·스탬프가 앵커 격자에 스냅(방안뜨기 기초). `snapToGrid`/`setAnchor`/`drawAnchor`.
- 라이트/다크 모드(더보기 ⋯ 메뉴, `html[data-theme=light]`), 모바일 반응형(`@media≤640px` 세로 스택), 패널 접기(좌/우), 실 DB·AI·단수카운터 제거.
- **프로크리에이트식 UI(완료, main 병합됨)**: 좌측 세로 **모드 도크**(`#tooldock` 도장/손글씨/T/지우개/선택/영역) + **크기 레일**(`#size-rail`, 도장=stampSz·그리기=brushSz) + 풀블리드 캔버스(도구옵션 패널 `#sr`은 ⚙로 on-demand) + 상단 **색상 스와치+팝오버**(`#topcol`/`#colpop`, `setColor`/`buildColorPicker`로 패널·팝오버·스와치 동기화) + **⋯ 더보기 팝오버**(`#morepop`: 테마·패널위치·내보내기·초기화). 두 팝오버 상호배타·바깥클릭 닫힘.

## 커스텀 기호(자작) 시스템 — 완료, main 병합됨
- `G.userSymbols` = 자작 글리프 배열. 글리프 = 정규화 셀(좌표 -1..1=±h) 안의 요소들: `{t:'line',pts:[[x,y]..]}`/`{t:'dot',x,y,r}`/`{t:'circ',x,y,r}`/`{t:'sym',id,x,y,s}`(기존기호 삽입=조합). 내부가 몇 개든 한 칸(size)로 정규화.
- `drawCustomGlyph()` 렌더 + `drawSVGStitch`가 `cus_*` id를 위임(자기참조 가드). `addCustomSymbol/deleteCustomSymbol/persistUserSymbols/loadUserSymbols`(localStorage `cony_usersymbols_v1`, init에서 로드).
- 팔레트(#stitch-list)에 표준 뒤로 `.sc.cus` 표시(탭=스탬프 선택, 길게=삭제). 편집기 모달 `#m-sym`(좌하단 ‘＋ 내 기호 만들기’): 정규화 캔버스에 선(폴리라인+✓선완료)·점·원·기호삽입(표준22종 조합) 탭으로 그림, 되돌리기/비우기/저장. `openSymEditor/drawSymEditor/symCanvasTap/bindSymEditor`.

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
