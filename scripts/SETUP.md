# stock-plan 자동 push 설정 가이드 (mac)

매일 오전 7시에 Cowork가 리포트를 `stock-report/`에 생성하고,
낮 12시에 mac의 launchd가 자동으로 commit + push 합니다.

---

## 0. (한 번만) stale lock 정리 + 첫 push 테스트

터미널(Terminal.app)에서 아래를 그대로 실행하세요.

```bash
cd ~/Documents/GitHub/stock-plan
rm -f .git/index.lock                 # 남아있던 잠금파일 제거
bash scripts/auto-push.sh             # 지금 바로 commit + push 테스트
```

처음 push할 때 GitHub 로그인 창이 뜨면 로그인하세요. 한 번 인증하면
macOS 키체인에 저장되어 이후 자동 실행 시 재입력이 필요 없습니다.
(인증이 자꾸 막히면 아래 "SSH로 전환" 참고)

push가 성공하면 https://github.com/chaeniverse/stock-plan 에서 파일이 보입니다.

---

## 1. launchd 등록 (자동 실행)

```bash
# plist를 LaunchAgents 폴더로 복사
cp ~/Documents/GitHub/stock-plan/scripts/com.chaeniverse.stockplan-push.plist \
   ~/Library/LaunchAgents/

# 등록 (macOS 최신 방식)
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.chaeniverse.stockplan-push.plist

# 잘 등록됐는지 확인
launchctl list | grep stockplan
```

> 구버전 macOS라면 `launchctl load ~/Library/LaunchAgents/com.chaeniverse.stockplan-push.plist`

### 바로 한 번 실행해 테스트
```bash
launchctl kickstart -k gui/$(id -u)/com.chaeniverse.stockplan-push
cat ~/Documents/GitHub/stock-plan/scripts/push.log
```

### 해제하고 싶을 때
```bash
launchctl bootout gui/$(id -u)/com.chaeniverse.stockplan-push
```

---

## 2. (선택) HTTPS 대신 SSH로 전환 — 인증 더 안정적

launchd 같은 백그라운드 실행에서는 SSH 키 방식이 가장 안정적입니다.

```bash
# SSH 키가 없다면 생성
ssh-keygen -t ed25519 -C "chaehyun3253@gmail.com"
cat ~/.ssh/id_ed25519.pub          # 출력값을 GitHub > Settings > SSH keys 에 등록

# 원격 주소를 SSH로 변경
cd ~/Documents/GitHub/stock-plan
git remote set-url origin git@github.com:chaeniverse/stock-plan.git
```

---

## 파일 설명
- `auto-push.sh` : 변경분을 commit 후 push. 수동/자동 모두 사용.
- `com.chaeniverse.stockplan-push.plist` : 매일 12:00 자동 실행 정의.
- `push.log` / `launchd.*.log` : 실행 기록(자동 생성).
