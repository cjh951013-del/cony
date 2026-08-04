/* android/ 는 .gitignore 대상이라 `npx cap add android` 로 언제든 새로 만들어진다.
   그때마다 손으로 다시 넣어야 하는 설정들을 한 번에 적용한다 — 빠뜨리면 빌드는 성공하는데
   타깃 SDK가 낮거나 서명이 빠진 결과물이 조용히 나오기 때문에, 사람 손에 맡기지 않는다.
   사용: npm run android:setup  (cap add android 다음에 실행) */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AND = path.join(ROOT, 'android');
if (!fs.existsSync(AND)) {
  console.error('android/ 가 없습니다. 먼저 `npx cap add android` 를 실행하세요.');
  process.exit(1);
}

const edits = [];
function patch(file, fn) {
  const p = path.join(AND, file);
  if (!fs.existsSync(p)) { edits.push(`skip  ${file} (없음)`); return; }
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) { fs.writeFileSync(p, after); edits.push(`patch ${file}`); }
  else edits.push(`ok    ${file} (변경 없음)`);
}

// 1) 타깃/컴파일 SDK — 신규 앱은 2026-08-31까지 API 36 필수
patch('variables.gradle', s => s
  .replace(/compileSdkVersion\s*=\s*\d+/, 'compileSdkVersion = 36')
  .replace(/targetSdkVersion\s*=\s*\d+/, 'targetSdkVersion = 36'));

// 2) 버전명 + 릴리스 서명. 서명 정보는 keystore.properties(git 제외)에서만 읽고,
//    파일이 없으면 서명을 건너뛰어 디버그 빌드가 그대로 되게 한다.
patch('app/build.gradle', s => {
  s = s.replace(/versionName\s+"[^"]*"/, 'versionName "1.0.0"');
  if (!s.includes('keystore.properties')) {
    s = s.replace(/^apply plugin: 'com\.android\.application'/m,
`apply plugin: 'com.android.application'

// 서명 정보는 keystore.properties(git 제외)에서만 읽는다. 없으면 릴리스 서명을 건너뛴다.
def keystorePropsFile = rootProject.file("keystore.properties")
def keystoreProps = new Properties()
if (keystorePropsFile.exists()) keystoreProps.load(new FileInputStream(keystorePropsFile))`);
    s = s.replace(/(\n    buildTypes \{)/,
`
    signingConfigs {
        release {
            if (keystoreProps.containsKey("storeFile")) {
                storeFile rootProject.file(keystoreProps["storeFile"])
                storePassword keystoreProps["storePassword"]
                keyAlias keystoreProps["keyAlias"]
                keyPassword keystoreProps["keyPassword"]
            }
        }
    }$1`);
    s = s.replace(/(release \{\n\s*minifyEnabled false)/,
`$1
            if (keystoreProps.containsKey("storeFile")) signingConfig signingConfigs.release`);
  }
  return s;
});

// 3) local.properties — 기기마다 다른 SDK 경로. 커밋 대상이 아니므로 매번 만들어 준다.
//    Java properties 파일이라 역슬래시가 이스케이프로 먹힌다 → 슬래시로 쓴다.
const sdk = (process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || '').replace(/\\/g, '/');
const lp = path.join(AND, 'local.properties');
if (sdk) {
  fs.writeFileSync(lp, `sdk.dir=${sdk}\n`);
  edits.push('write local.properties');
} else if (!fs.existsSync(lp)) {
  edits.push('warn  local.properties 없음 — ANDROID_HOME 환경변수를 설정하거나 직접 만드세요');
}

console.log(edits.join('\n'));
