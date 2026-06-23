# CONY — 뜨개 도안 제작 앱

단일 파일: **`index.html`** (순수 HTML/CSS/JS, 1200×1200 래스터 캔버스).  
아내의 코바늘 멘탈헬스 브랜드 + 남편(cjh95)이 만드는 앱. 슬로건 "멈춰도 돼, 포기만 안 하면". 목표: 웹·Android·iOS·와디즈 펀딩.

## 실행
```
npx serve . -l 3940   # http://localhost:3940
```
폰 테스트: 같은 와이파이에서 `http://<PC-IP>:3940`. GitHub Pages 직접 배포 가능.

## 아키텍처 요약
- 캔버스 3겹: `bgCtx`(격자) / `mainCtx`=활성레이어포인터 / `prevCtx`(미리보기오버레이)
- `G` = 전역 상태, `composite()` = 전 레이어 합성, `fitToScreen()` = 폰 필수
- `drawSVGStitch(ctx,x,y,id,color,size,rot)` = 기호 렌더 진입점
- **상세 아키텍처**: `@docs/ARCH.md`

## 현재 상태
Procreate 감성 기능 완료 (2026-06-23). 이력: `docs/HISTORY.md` | 남은 작업: `docs/ROADMAP.md`

## 제약
- 에러 0 (전 플랫폼 출시). 변경은 작게, 매 커밋마다 `node -e "new Function(js)"` 검증.
- 브러쉬 저작권: 와디즈 유료 브러쉬팩 복제 금지. 표준 기호는 산업표준 자작 OK.
- 단수표 자동 불가 — 래스터 캔버스라 행별 코수 역산 불가.
