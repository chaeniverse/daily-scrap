#!/bin/bash
# ─────────────────────────────────────────────────────────────
# stock-plan 자동 commit & push 스크립트
# 매일 launchd가 실행하거나, 수동으로 실행해 테스트할 수 있습니다.
#   수동 실행:  bash ~/Documents/GitHub/stock-plan/scripts/auto-push.sh
# ─────────────────────────────────────────────────────────────
set -euo pipefail

REPO="/Users/chaehyun/Documents/GitHub/stock-plan"
LOG="$REPO/scripts/push.log"
cd "$REPO"

# git을 PATH에서 못 찾는 launchd 환경 대비
export PATH="/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

# 혹시 남아있는 stale lock 정리
[ -f .git/index.lock ] && rm -f .git/index.lock

git add -A

# 변경사항이 있을 때만 커밋/푸시
if git diff --cached --quiet; then
  echo "$(date '+%Y-%m-%d %H:%M:%S')  변경 없음, 건너뜀" >> "$LOG"
  exit 0
fi

git commit -m "Auto: stock report $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo "$(date '+%Y-%m-%d %H:%M:%S')  push 완료" >> "$LOG"
