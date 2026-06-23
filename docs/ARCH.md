# CONY 상세 아키텍처

## 캔버스 구조
3겹 캔버스: `bg-c`(격자·프레임·앵커마커) / `main-c`=`dispCtx`(표시전용 합성결과) / `prev-c`(미리보기·편집핸들, pointer-events:none).  
실제 그리기는 오프스크린 레이어 캔버스(`l.cv/l.ctx`)에, `mainCtx`=활성 레이어 포인터.  
`composite()` — 가시성·불투명도·blend·클리핑마스크·레이어마스크 순서 합성 → dispCtx.  
`CW=CH=1200`, `getPos(e)` — zoom/pan 역변환으로 캔버스 좌표 반환.

## 핵심 전역
- `G` — 전역 상태(mode, stitch, color, zoom, pan, rot, layers, activeL, hist, histIdx, symmetry, anchor, float, selStart/End/Path, maskLayerId, qmSlots …)
- `setActiveCtx()` — `mainCtx`를 활성 레이어 ctx(또는 마스크 ctx)로 갱신
- `renderLayers()` — 레이어 패널 재렌더
- `fitToScreen()` — 1200×1200을 #cw 뷰포트에 꽉 맞춤(폰 필수)
- `drawSVGStitch(ctx,x,y,id,color,size,rot)` — 표준 뜨개 기호 렌더

## 드로잉 파이프라인
onDown → 경로 기록(`G.path`) → onMove `renderPreview()`(prev 미리보기) → onUp `commitStroke()`/`stampPolyCtx()` → `composite()` → `saveH()`.  
길게 누르기(HOLD_MS=2000)/두 번째 손가락/Shift → `enterSnap()` → QuickShape 편집 핸들.

## 멀티터치 제스처
- 2터치 드래그/핀치=팬·줌·회전, 2터치 탭=undo, 3터치 탭=redo, 4터치 탭=UI 숨기기
- 2터치 수평 스와이프(>55px)=undo(좌)/redo(우), 3터치 아래 스와이프=복사·붙여넣기 메뉴

## 레이어 시스템
P1~P5 완료(레이어·스포이드·대칭·컬러휠·캔버스액션).  
레이어별 alphaLock·clip(클리핑마스크)·mask(레이어마스크)·blend 지원.  
영속화: `cony_layers_<id>` localStorage에 PNG+메타.  
undo/redo: `saveH()`=단일, `saveHMulti()`=전 레이어, `prevDataFor(lid,idx)`로 복원.

## 선택·변형
`G.selMode`=rect/ellipse/lasso, `selRect()`=bbox, `traceSel()`=경로 그리기.  
`liftToFloat()` → `G.float`({cv,x,y,w,h,rot}) → 이동·회전·코너리사이즈 → `commitFloat()`.  
마칭 앤츠: `startMarchAnts()`/`stopMarchAnts()` — rAF 루프로 선택 경계 애니메이션.

## QuickMenu (QMenu)
`G.qmSlots`(6개) → `renderQMenu()` → `bindQMenuItems()`. 길게 누르면 `openQMPicker()`.  
`QM_ACTIONS` 레지스트리 14종. localStorage `qmSlots`에 영속.

## 기호 시스템
표준 기호 22+종 → `drawSVGStitch`. 자작 기호: `G.userSymbols`, `drawCustomGlyph()`.  
`cony_usersymbols_v1` localStorage 영속.

## 색상
HSB 컬러휠(`drawColorWheel`, `hsv2rgb/rgb2hsv`), 색 히스토리 최대10(`G.colorHist`).  
Color Drop: `topcol` 드래그 → 캔버스 드롭 → `floodFill()` + 임계값 드래그.  
아이드로퍼 루페: `startLpPick()` 길게 누름 → `#lp-ring` canvas 루페(6× 확대+스와치).

## 검증
JS 구문 검증: `node -e "new Function(js_content)"`.  
DOM 검증: getImageData 픽셀 수, getComputedStyle 등(스크린샷 타임아웃 잦음).
