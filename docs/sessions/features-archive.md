# 전체 기능 이력 (상세)

## 2026-06-21 P1~P5 (Procreate 패리티)
- P1 레이어: 오프스크린 캔버스, composite(), 레이어별 undo, 패널 UI
- P2 스포이드: pickColorAt, 직전 모드 복귀
- P3 대칭: v/h/quad/radial, symXf(), 모든 그리기 도구 적용
- P4 컬러휠: HSB 디스크+명도슬라이더, 색 히스토리 10개
- P5 캔버스 액션: 좌우/상하 반전(전 레이어), multiHist
- 코·단 번호매기기, 표준기호 +10, 범례 자동, 방사 배치, 방안뜨기 모드

## 2026-06-22 Procreate UI v3
- 상단바: 갤러리/동작/가이드/선택/변형 | 펜/지우개/레이어/색상
- 좌측 토크: 크기·불투명도 세로 슬라이더, 스포이드, undo/redo
- fitToScreen(), 토글 팝오버 패널, 모바일 반응형

## 2026-06-22~23 Procreate 감성 기능
- zoom HUD·회전 HUD 탭→리셋, 더블탭 줌 토글
- 선명도(Sharpen)·비네팅(Vignette) 조정, 정렬 스냅 가이드, 그라디언트 채우기
- 원근 격자 가이드, Color Balance, 레이어 불투명도 ← → 드래그
- QuickMenu 2-finger 장누름, 레이어 복제, 파일 드래그&드롭·클립보드 붙여넣기
- 레이어 마스크(toggleLayerMask, maskLayerId, 오렌지 테두리)
- 픽셀화·색상반전·흑백 임계 필터
- 스타일러스 압력 감응(_penPressure), 엣지 스와이프(패널 토글)
- QuickMenu 슬롯 커스터마이즈(14종 중 선택, localStorage)
- 참조 이미지 패널(드래그·최소화·불투명도), Before/After 비교
- 기호 채우기 fillWithPattern()
- 첫 실행 제스처 가이드 오버레이(gi_seen localStorage)
- 레이어 스와이프-to-reveal (복제/잠금/삭제 퀵버튼)
- 마칭 앤츠 선택 애니메이션, Float 코너 리사이즈 핸들 (Free Transform)
- 아이드로퍼 루페 (6× 확대+스와치), Drawing Assist 배지
- Undo/Redo 캔버스 플래시 애니메이션

## 2026-06-23 S3
- 주석 기호 탭 (✎주석 5번째 팔레트 탭, STITCHES.annotation 12종)
- 주석 레이어 버튼 (isAnnotation 레이어, 오렌지 배지)
- 치수선 도구 dimline (2점 클릭 → 선+화살촉+칸수 레이블, prevCtx 미리보기)
- 패턴 반복 채우기 sel-tile, 단 계산기 HUD (localStorage 영속)
- 다중 프레임 자유배치 canvasFrames (Pro), 격자 스냅 stampAt (40px 칸 중앙 정렬)

## 2026-06-23 S4
- 주석 탭 SVG 아이콘 (5개 탭 pc-ic 스타일 통일)
- 토스페이먼츠 v1 실결제 연동 (SDK·requestPayment·pay_ok URL 파라미터)
- plan localStorage 영속화 (loadPersisted에서 복원, co-done에서 저장)
- Capacitor 패키징 스캐폴드 (package.json·capacitor.config.json)
- 색상 모델 정리 (#14): 기호 선택 시 toolColor → G.color 동기화

## 2026-06-23 S5
- PWA manifest.json + Service Worker(sw.js) — 오프라인 캐시
- Web Share API 내보내기 — 모바일 네이티브 공유시트
- icons/icon.svg + icons/gen-icons.html (브라우저에서 192/512 PNG 다운로드)
- 서술도안 PDF — 새 창 인쇄 파이프라인(한글 폰트·제목·날짜)
- .cony 프로젝트 파일 내보내기/불러오기 (레이어 PNG+메타 JSON)
- 에디터 헤더 중앙 프로젝트 이름 편집 — blur/Enter 저장, hover 강조
- fix: PNG 내보내기 투명 배경 (기존엔 bg-c 포함돼 불투명)
