# 남은 작업

## 코드 작업 (남음)
- Toss 실키 교체: `TOSS_CLIENT_KEY` (index.html 1363줄) + `TOSS_SECRET_KEY` (Netlify env var) 둘 다 실제 키로 교체
- Netlify 배포: `netlify deploy --prod` 또는 GitHub 연동 후 자동 배포

## 사용자가 직접 해야 할 것
- `icons/gen-icons.html` 브라우저에서 열어 icon-192/512.png 다운로드 → `icons/` 폴더에 저장
- `npm install && npx cap add android && npx cap add ios` → `npm run cap:sync` → 실기기 빌드
- 와디즈 펀딩 등록: `docs/wadiz-copy.md` 카피 복붙 → 스크린샷 5장 첨부

## 완료
- ✅ 기호별 회전 고정 (toolRots + rotLocked 잠금버튼 + 프리셋 45/90/135/-90°)
- ✅ Netlify Functions confirm-payment.js (서버사이드 Toss 확인)
- ✅ netlify.toml 설정
- ✅ successUrl Netlify 자동 감지 분기
- ✅ 와디즈 펀딩 카피 (docs/wadiz-copy.md)

## 영구 불가
- 단수표 자동 (#16): 래스터 비트맵이라 행별 코수 역산 불가
