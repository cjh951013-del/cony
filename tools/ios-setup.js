/* ios/ 는 .gitignore 대상이라 `npx cap add ios` 로 매 빌드마다 새로 만들어진다.
   그때마다 되돌아가는 설정을 한 번에 적용한다 — 특히 최소 iOS 버전은 빠뜨려도 빌드가
   성공해 버리기 때문에(업로드 후 ITMS-90068 경고 메일로만 알게 된다) 사람 손에 맡기지 않는다.
   사용: npm run ios:setup  (cap add ios 다음, cap sync ios 앞에서 실행) */
const fs = require('fs');
const path = require('path');

// 애플: 2027년 봄부터 MinimumOSVersion 15.0 미만은 App Store Connect 업로드 자체가 막힌다.
// Capacitor 6 기본값이 13.0이라 그대로 두면 매번 경고를 받는다.
const MIN_IOS = '15.0';

const ROOT = path.resolve(__dirname, '..');
const IOS = path.join(ROOT, 'ios');
if (!fs.existsSync(IOS)) {
  console.error('ios/ 가 없습니다. 먼저 `npx cap add ios` 를 실행하세요.');
  process.exit(1);
}

const edits = [];
function patch(file, fn) {
  const p = path.join(IOS, file);
  if (!fs.existsSync(p)) { edits.push(`skip  ${file} (없음)`); return; }
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) { fs.writeFileSync(p, after); edits.push(`patch ${file}`); }
  else edits.push(`ok    ${file} (변경 없음)`);
}

// 이미 15.0 이상이면 건드리지 않는다. Capacitor가 나중에 기본값을 올려도 되돌리지 않도록.
const tooLow = v => parseFloat(v) < parseFloat(MIN_IOS);

// 1) Xcode 프로젝트 — Debug/Release, 프로젝트/타깃 레벨까지 전부 (기본 4곳).
patch('App/App.xcodeproj/project.pbxproj', s =>
  s.replace(/IPHONEOS_DEPLOYMENT_TARGET = ([\d.]+);/g,
    (m, v) => tooLow(v) ? `IPHONEOS_DEPLOYMENT_TARGET = ${MIN_IOS};` : m));

// 2) Podfile — Capacitor의 post_install assertDeploymentTarget 이 여기 platform 값을
//    각 Pod 타깃에 그대로 밀어 넣는다. 앱만 올리고 Pod를 두면 경고가 남는다.
patch('App/Podfile', s =>
  s.replace(/platform :ios, '([\d.]+)'/,
    (m, v) => tooLow(v) ? `platform :ios, '${MIN_IOS}'` : m));

// 3) 수출 규정 면제 선언. 코니는 자체 암호화를 구현하지 않고 HTTPS도 iOS 것을 그대로
//    쓴다. 이 키가 없으면 업로드할 때마다 App Store Connect 에서 "수출 규정 관련 문서
//    누락" 이 뜨고, 손으로 답하기 전에는 테스터가 빌드를 설치하지 못한다.
patch('App/App/Info.plist', s => s.includes('ITSAppUsesNonExemptEncryption') ? s
  : s.replace(/(\n<\/dict>)/, '\n\t<key>ITSAppUsesNonExemptEncryption</key>\n\t<false/>$1'));

// 적용 결과를 값으로 확인한다. 치환이 조용히 빗나가면 여기서 걸린다.
const plist = path.join(IOS, 'App/App/Info.plist');
if (!/<key>ITSAppUsesNonExemptEncryption<\/key>\s*<false\/>/.test(fs.readFileSync(plist, 'utf8'))) {
  console.error('실패: Info.plist 에 ITSAppUsesNonExemptEncryption=false 가 들어가지 않았습니다');
  process.exit(1);
}
const pbx = path.join(IOS, 'App/App.xcodeproj/project.pbxproj');
const left = (fs.readFileSync(pbx, 'utf8').match(/IPHONEOS_DEPLOYMENT_TARGET = [\d.]+;/g) || []);
const bad = left.filter(l => tooLow(l.match(/= ([\d.]+);/)[1]));
console.log(edits.join('\n'));
console.log(`최소 iOS: ${[...new Set(left)].join(', ')} (총 ${left.length}곳)`);
if (bad.length) {
  console.error(`실패: ${MIN_IOS} 미만이 ${bad.length}곳 남았습니다 — ${bad.join(' ')}`);
  process.exit(1);
}
