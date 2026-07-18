# Windows에서 iOS 앱 만들기 — Codemagic 가이드 (3회 나눠서)

**코드매직(Codemagic)이 뭐냐면**: 클라우드에 있는 맥(Mac)을 빌려주는 서비스야.
우리가 GitHub에 코드를 올려두면, 코드매직의 맥이 그걸 받아서 iOS 앱(.ipa)으로 빌드하고
애플 서버(TestFlight)까지 올려줘. **우리 PC에서는 버튼만 누르면 됨. 맥 불필요.**

- **무료로 충분**: 개인 계정은 매달 500분 무료 (매월 1일 리셋). 코니 1회 빌드 ≈ 10~15분 → 월 30회 이상 가능.
- 준비물: ✅ Apple Developer 가입(완료), GitHub 계정(있음), 이메일.
- 설정 파일(`codemagic.yaml`)과 빌드 스크립트는 저장소에 이미 준비돼 있음 — 아래는 계정 연결 작업만.

---

## 1회차 — 계정 연결 (약 20~30분, 한 번만)

### 1-A. Codemagic 가입
1. https://codemagic.io 접속 → **Sign up** → **GitHub으로 로그인** 선택
2. GitHub 권한 요청이 뜨면 승인 (cony 저장소 접근 허용)
3. 로그인 후 **Add application** → 저장소 목록에서 `cony` 선택 → "Ionic/Capacitor" 또는 "Other" 선택
   → `codemagic.yaml`을 자동으로 발견함

### 1-B. App Store Connect API 키 발급 (애플 쪽)
코드매직이 내 애플 계정에 앱을 올릴 수 있게 허락해주는 열쇠야.
1. https://appstoreconnect.apple.com 로그인 → **사용자 및 액세스(Users and Access)** → **통합(Integrations)** 탭 → **App Store Connect API**
2. **키 생성(Generate API Key)**: 이름 `codemagic`, 액세스 권한 **App Manager**
3. 생성되면 세 가지를 챙겨: **Issuer ID**(위쪽에 표시), **Key ID**, **.p8 파일 다운로드**
   ⚠ .p8 파일은 **한 번만** 다운로드 가능 — 잘 보관해!

### 1-C. 코드매직에 키 등록
1. Codemagic → 오른쪽 위 **Teams** → 내 개인 팀 → **Integrations** → **Developer Portal** → **Manage keys**
2. **Add key**: 이름을 정확히 **`cony-asc-key`** 로 입력 (yaml에 적힌 이름과 같아야 함)
   Issuer ID / Key ID 입력 + .p8 파일 업로드 → 저장

### 1-D. App Store Connect에서 앱 등록 (한 번만)
1. App Store Connect → **앱(Apps)** → **＋** → **신규 앱**
2. 플랫폼 iOS / 이름 **코니** / 기본 언어 한국어 / 번들 ID **com.cony.app** (없으면 먼저
   https://developer.apple.com/account/resources/identifiers 에서 Identifiers ＋ → App IDs → Bundle ID
   `com.cony.app` 명시적(explicit)으로 등록) / SKU는 아무거나 (예: cony001)

여기까지 하면 1회차 끝. 이제 애플·코드매직·GitHub이 전부 연결됐어.

## 2회차 — 첫 빌드 (버튼 누르고 기다리기, 약 15~20분)

1. Codemagic → cony 앱 → **Start new build** → workflow `CONY iOS (TestFlight)` 선택 → **Start build**
2. 로그가 실시간으로 올라옴. 성공하면 초록색 + .ipa 아티팩트 + "TestFlight 업로드 완료"
3. 실패하면? 로그 마지막 부분을 복사해서 Claude(나)한테 붙여넣어줘 — 원인 잡아서 yaml 고쳐줄게.
   (첫 빌드는 서명·인증서 문제로 한두 번 실패하는 게 아주 흔한 일이야. 당황 금지.)

## 3회차 — 아이폰/아이패드에 설치 (약 10분)

1. 아이폰에서 App Store 앱으로 **TestFlight** 설치 (파란 프로펠러 아이콘)
2. App Store Connect → 앱 코니 → **TestFlight 탭** → 내부 테스팅 → 그룹 만들고 내 Apple ID(이메일) 추가
3. 아이폰 TestFlight 앱에 코니가 나타남 → 설치 → 실행 🎉
4. 이후에는: 코드 수정 → GitHub 푸시 → Codemagic에서 Start build → TestFlight에 새 버전 자동 등록
   (아이폰이 알림으로 "새 버전 있음" 알려줌)

---

## 자주 묻는 것

- **돈 드는 거 아냐?** 코드매직 무료 500분/월 + Apple Developer 연 $99(이미 냄). 추가 비용 없음.
- **App Store 정식 출시하려면?** TestFlight 테스트가 끝난 뒤 App Store Connect에서 심사 제출
  (스크린샷·설명 등록 → 제출). 그건 그때 다시 안내.
- **빌드번호/버전은?** yaml이 자동으로 빌드 번호를 올려줌. 마케팅 버전(1.0.0)은 나중에 바꾸고 싶을 때 말해줘.
- **Android는?** 같은 저장소로 Codemagic에서 Android 워크플로도 추가 가능(로컬 Android Studio 없이).
  원하면 yaml에 추가해줄게.
