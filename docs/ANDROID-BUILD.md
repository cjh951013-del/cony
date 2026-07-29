# 안드로이드 빌드·출시

## 지금 상태 (2026-07-29)

디버그 APK는 **이미 나와 있다**. `build-out/cony-debug.apk` — 폰에 옮겨 설치하면 바로 돌아간다.
패키지 `com.cony.app`, 앱 이름 "코니", 런처 아이콘(대바늘×코바늘 적응형) 적용 완료.

플레이스토어 출시만 아래 절차가 추가로 필요하다.

---

## 내가(클로드) 할 수 있는 것

- 디버그 APK 빌드 — 완료
- 릴리스 서명 설정(`android/app/build.gradle`) — 완료. `keystore.properties`가 있으면 자동으로 서명하고, 없으면 건너뛴다
- 키 파일이 생긴 뒤 릴리스 AAB 빌드
- 스토어 등록물 초안: 앱 설명, 스크린샷, 그래픽 이미지, 개인정보처리방침
- 버전 올리기, 타깃 SDK 대응

## 사용자가 직접 해야 하는 것

계정·결제·신분확인·비밀번호가 걸린 부분은 대신 못 한다.

### 1. 플레이 콘솔 개발자 계정
- https://play.google.com/console 에서 등록, **최초 1회 $25** (신용/체크카드만, 페이팔 불가)
- **신분 확인 필수**: 정부 발급 신분증 + 셀피 업로드. 보통 몇 시간~2영업일
- 신분증·결제카드·개발자 프로필의 이름이 서로 일치해야 한다

### 2. 서명 키(키스토어) 생성
비밀번호를 정하는 일이라 본인이 직접 실행해야 한다. 아래를 그대로 실행:

```bash
keytool -genkeypair -v -keystore cony-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias cony
```

비밀번호를 물으면 원하는 값을 넣고, 그 `cony-upload.jks` 파일을 `android/` 폴더에 둔 뒤
`android/keystore.properties`를 아래 내용으로 만든다(이 파일은 git에 안 올라간다):

```
storeFile=cony-upload.jks
storePassword=정한_비밀번호
keyAlias=cony
keyPassword=정한_비밀번호
```

> **키 분실은 치명적이지 않다.** 플레이 앱 서명(Play App Signing)을 쓰면 키가 두 개로 나뉜다 —
> 실제 사용자에게 영향을 주는 *앱 서명 키*는 구글이 보관하고, 우리가 가진 건 *업로드 키*뿐이다.
> 업로드 키를 잃어버리면 콘솔에서 재설정을 요청할 수 있고(보통 1~2영업일), 사용자는 아무 영향을 받지 않는다.
> 재설정이 불가능한 건 플레이 앱 서명을 쓰지 않는 경우뿐이다.

### 3. ★비공개 테스트 12명 × 14일 (신규 개인 계정 필수)
**2023년 11월 13일 이후에 만든 개인 계정**은 이 단계를 통과해야 프로덕션 출시가 열린다.
- 테스터 **12명이 실제로 설치**하고 **14일 연속** 유지되어야 한다 (초대만 하고 설치 안 하면 미포함)
- 이후 프로덕션 액세스 신청 → 검토 보통 7일 이내
- 사업자로 등록한 **조직(Organization) 계정은 면제**된다. 아내 브랜드를 사업자로 등록할 계획이 있다면
  개인 계정 대신 조직 계정으로 시작하는 쪽이 이 단계를 통째로 건너뛴다 — 등록 전에 판단할 것

### 4. 기타 마감 기한
- 신규 앱은 **2026년 8월 31일까지 타깃 API 36(안드로이드 16)** 필요
- 개발자 인증 제도가 2026년 9월 30일부터 일부 국가에서 시작(브라질·인도네시아·싱가포르·태국), 2027년 글로벌 확대

---

## 빌드 명령

```bash
npm run web:build        # dist/ 갱신 — 소스 수정 후 반드시 먼저
npx cap sync android     # dist/ → android 프로젝트로 복사
```

디버그 APK (기기 테스트용):
```bash
cd android && ./gradlew assembleDebug
```

릴리스 AAB (플레이스토어 업로드용, keystore.properties 필요):
```bash
cd android && ./gradlew bundleRelease
```

★**함정**: `cap sync` 없이 gradle만 돌리면 **예전 웹 자산이 그대로 들어간다**.
실제로 2026-07-29 첫 빌드에서 대바늘 수정 이전 index.html이 APK에 박혀 나갔다.
빌드 후 확인법:
```bash
unzip -p android/app/build/outputs/apk/debug/app-debug.apk assets/public/index.html | wc -c
```
이 값이 소스 `index.html` 크기와 같아야 한다.

---

## 스토어를 거치지 않는 배포 (지금 당장 가능)

- **APK 직접 배포**: `build-out/cony-debug.apk`를 카톡·드라이브로 전달. "출처를 알 수 없는 앱" 허용 필요.
  아내와 지인 테스트에는 이걸로 충분하다
- **PWA**: https://cjh951013-del.github.io/cony/ 를 폰 브라우저로 열고 "홈 화면에 추가" — 계정도 비용도 0
