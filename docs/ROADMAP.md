# 남은 작업

## 코드 작업
- Toss 실키 교체 + 서버사이드 `/payments/confirm` 엔드포인트 (secretKey 절대 프론트 금지)
- 와디즈 펀딩 페이지 마크업 + 스크린샷 자동화

## 사용자가 직접 해야 할 것
- `icons/gen-icons.html` 브라우저에서 열어 icon-192/512.png 다운로드 → `icons/` 폴더에 저장
- `npm install && npx cap add android && npx cap add ios` → `npm run cap:sync` → 실기기 빌드

## 영구 불가
- 단수표 자동 (#16): 래스터 비트맵이라 행별 코수 역산 불가
