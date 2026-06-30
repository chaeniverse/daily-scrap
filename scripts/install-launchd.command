#!/bin/bash
# =========================================================
#  stock-plan 자동 push 설치 버튼 (매일 오전 11:00)
#  더블클릭하면 launchd 예약작업을 내 Mac에 등록/갱신합니다.
#  등록되면 매일 11:00에 auto-push.sh가 자동으로 commit & push 합니다.
#  (재설치/시간변경 시 다시 더블클릭하면 됩니다.)
# =========================================================
set -uo pipefail

LABEL="com.chaeniverse.stockplan-push"
REPO="/Users/chaehyun/Documents/GitHub/stock-plan"
SRC="$REPO/scripts/$LABEL.plist"
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"

echo "📦 stock-plan 자동 push(매일 11:00) 설치 중..."
echo

if [ ! -f "$SRC" ]; then
  echo "❌ plist 원본을 찾을 수 없습니다: $SRC"
  read -n 1 -s -r -p "아무 키나 누르면 창이 닫힙니다..."; exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents"
cp "$SRC" "$DEST"
chmod +x "$REPO/scripts/auto-push.sh"
echo "✓ plist 복사: $DEST"

# 기존 등록 해제(있으면) 후 다시 등록 — 최신/구형 launchctl 모두 대응
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null
launchctl unload "$DEST" 2>/dev/null

if launchctl bootstrap "gui/$(id -u)" "$DEST" 2>/dev/null; then
  echo "✓ launchctl bootstrap 등록 완료"
else
  launchctl load "$DEST" && echo "✓ launchctl load 등록 완료"
fi

echo
echo "▼ 현재 등록 상태:"
launchctl list | grep "$LABEL" || echo "(목록에서 못 찾음 — 아래 안내 확인)"

echo
echo "🎉 설정 끝! 이제 매일 오전 11:00에 자동으로 GitHub에 push 됩니다."
echo "   (Mac이 켜져 있고 로그인된 상태여야 실행됩니다. 그 시각에 꺼져 있었다면"
echo "    다음에 깨어날 때 한 번 실행됩니다.)"
echo "   지금 바로 테스트하려면: bash \"$REPO/scripts/auto-push.sh\""
echo
read -n 1 -s -r -p "아무 키나 누르면 창이 닫힙니다..."
