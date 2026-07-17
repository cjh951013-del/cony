# CONY — 뜨개 도안 제작 앱

단일 파일: **`index.html`** (순수 HTML/CSS/JS, 래스터 캔버스 무료 1200 / Pro 4000).  
아내의 코바늘 멘탈헬스 브랜드 + 남편(cjh95)이 만드는 앱. 슬로건 "멈춰도 돼, 포기만 안 하면". 목표: 웹·Android·iOS·와디즈 펀딩.  
**판단 기준: 도안 제작이 위주, 그림은 추가 옵션.** 도안에 불필요한 기능은 숨기거나 제거한다.

## 실행·배포
```
npx serve . -l 3940   # 기기 테스트용 (폰·태블릿: http://<PC-IP>:3940, 저장 즉시 반영)
npx serve . -l 3942   # 프리뷰 검증용 (launch.json name: cony-verify)
```
배포 = main 푸시 → GitHub Pages https://cjh951013-del.github.io/cony/ (1~2분 후 반영, SW 캐시 탓에 새로고침 두 번 필요할 수 있음. sw.js CACHE 'cony-v3', navigate 네트워크 우선).

## 아키텍처 요약
- 캔버스 레이어: `bgCtx`(격자·프레임 가이드) / `dispCtx`=#main-c(합성 표시) / `mainCtx`(활성 레이어 오프스크린) / `prevCtx`(미리보기) / `ghostCtx`(호버 고스트). `composite()`로 합성, `fitToScreen()` 폰 필수.
- `G` = 전역 상태. `drawSVGStitch(ctx,x,y,id,color,size,rot)` = 기호 렌더 진입점.
- **프레임 시스템이 중심축**: `G.canvasFrames[]` {x,y,w,h,kind:circle|semi|rect|grid}. 기호 스냅(`frameSnapInfo`), 연속 배치(`seqNextPos` — 탭마다 다음 슬롯, 단 완료 시 다음 단+단 계산기 연동), 서술도안(`genNarrative` 라운드/`genNarrativeFlat` 평편), 방안뜨기(`fillCell` — 격자 프레임 안 전용, `G.graphData` 문서별 저장/복원)가 전부 프레임 기준으로 동작.
- Pro 게이트: `isPro()`. 캔버스 크기·프레임 수(무료 3)·나만의 기호·레이어 수·서술도안 약어/영문.
- **상세**: `docs/ARCH.md` | 이력: `docs/HISTORY.md` | 남은 작업: `docs/ROADMAP.md`

## 현재 상태 (2026-07-15)
**핀피노 대응 로드맵 1~8번 전 항목 완료·배포.** 진행 트래커, 원형 생성기, 뜨기 방식 4종, 픽셀 도구+대칭, 이미지→방안 변환(median-cut), 정렬 바·미니맵·SVG 내보내기·안내선, 템플릿 카테고리화, 기호 5개 배치(~90종, 와디즈 zip 원본 이미지 전수 대조 완료 — 기본 sc는 ×가 표준, 구슬 내부선 n−2 등 실물 규칙은 docs/WADIZ-SYMBOLS.md). 모티브 보관함(무료2/Pro30), 백업/복원, 실물 크기(cm·A4) 가이드. 17항목 전체 회귀 테스트 + 3뷰포트 + 콘솔 0 통과(2026-07-15).  
대기 중: 실기기 테스트 피드백, Toss 실키·Netlify(결제), 아이콘·APK/iOS 빌드, 백엔드(BaaS) 결정 — 전부 사용자 액션(ROADMAP.md 참조).

## 검증 (매 변경마다, 커밋 전 필수)
1. `node tools/syncheck.js` — 전 스크립트 블록 문법 (exit 0 필수)
2. `node tools/dupid.js` — 중복 id 0 확인
3. 동작 검증: 프리뷰 서버(3942)에서 preview_eval로 합성 MouseEvent/TouchEvent 발사 + 캔버스 픽셀 카운트 단언. preview_screenshot은 자주 타임아웃 — 픽셀 단언으로 대체.
4. 콘솔 에러 0 확인 → 커밋·푸시. 실기기 문제 보고는 즉시 수정→검증→배포 사이클.

## 제약
- 에러 0 (전 플랫폼 출시). 변경은 작게.
- **`TOSS_SECRET_KEY` 절대 클라이언트 코드 금지** — Netlify 환경변수 전용 (netlify/functions/confirm-payment.js).
- 브러쉬 저작권: 와디즈 유료 브러쉬팩 복제 금지. 표준 기호는 산업표준 자작 OK.
- 단수표 자동 불가 — 래스터 캔버스라 행별 코수 역산 불가.

## 운영 모드 (모든 모델 공통)
어느 모델(Sonnet·Opus 등)로 열든 세션 시작 시 itsvff 스킬(VFF)을 자동 적용한다 — 별도 트리거 불필요. 핵심: 첫 문장=결론, 산문 우선(토막문장·화살표 체인 금지), 완료 주장 전 검증, 직접 본 것만 단정. 전문: `~/.claude/skills/itsvff/SKILL.md`.
