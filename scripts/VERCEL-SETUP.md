# Vercel 배포 설정 가이드 (한 번만)

이 repo에는 `stock-report/*.md` 리포트를 보여주는 **Next.js 웹사이트**가 들어 있습니다.
GitHub에 새 리포트가 push될 때마다 **Vercel이 자동으로 다시 빌드**해서 페이지를 갱신합니다.

전체 흐름:

```
매일 오전 7시   Cowork 예약 작업 → stock-report/ 에 .md 생성
오전 7시 15분   mac launchd → GitHub(chaeniverse/stock-plan)로 자동 push
push 직후       Vercel이 감지 → 자동 빌드 → https://<프로젝트>.vercel.app 갱신
```

launchd 자동 push는 이미 설정돼 있으니(`SETUP.md` 참고), 아래 **Vercel 연결만 한 번** 해주면 됩니다.

---

## 1. Vercel 계정 만들고 GitHub 연결

1. https://vercel.com 접속 → **Sign Up**.
2. **Continue with GitHub** 로 가입하면 GitHub 계정과 바로 연결됩니다.
   (개인 사용은 Hobby 플랜으로 무료입니다.)

---

## 2. repo를 Vercel 프로젝트로 가져오기

1. Vercel 대시보드에서 **Add New… → Project** 클릭.
2. **Import Git Repository** 목록에서 **`chaeniverse/stock-plan`** 의 **Import** 클릭.
   - 목록에 안 보이면 **Adjust GitHub App Permissions** 에서 이 repo 접근을 허용하세요.
3. 설정 화면이 뜨면 **그대로 두고** `Deploy` 만 누르면 됩니다. 확인 포인트:
   - **Framework Preset**: `Next.js` (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - Build/Install 명령은 **건드리지 마세요** (자동).
4. 1~2분 뒤 빌드가 끝나면 **`https://stock-plan-xxxx.vercel.app`** 주소가 생성됩니다.

---

## 3. 잘 되는지 확인

- 생성된 `*.vercel.app` 주소를 열면 **최신 리포트**가 보이고,
  아래에 **지난 리포트** 목록이 나옵니다.
- 이후에는 launchd가 push할 때마다(또는 GitHub에서 직접 수정 시) **자동 재배포**됩니다.
  손댈 것이 없습니다.

> 수동으로 다시 배포하고 싶으면 Vercel 프로젝트 → **Deployments** → 최신 항목 우측 **⋯ → Redeploy**.

---

## 4. (선택) 주소 외우기 쉽게 바꾸기

- Vercel 프로젝트 → **Settings → Domains** 에서 `stock-plan-xxxx` 부분을
  원하는 이름(예: `chae-stock`)으로 바꾸면 `https://chae-stock.vercel.app` 가 됩니다.
- 본인 도메인이 있다면 같은 화면에서 연결할 수 있습니다.

---

## 자주 묻는 것

- **빌드가 실패해요.** Vercel 프로젝트 → **Deployments** 에서 실패한 빌드를 클릭하면
  로그를 볼 수 있습니다. 보통 `package.json` 의존성 문제이며, 이 repo는 로컬 빌드로
  검증돼 있어 기본 설정 그대로면 통과합니다.
- **`No Output Directory named "public" found` 에러.** Vercel이 프로젝트를 Next.js가 아닌
  정적 사이트로 인식했을 때 납니다. repo의 `vercel.json` 에 `"framework": "nextjs"` 가 있어
  보통 자동 해결되지만, 그래도 나면 Vercel 프로젝트 → **Settings → Build & Deployment** 에서
  **Framework Preset 을 `Next.js`** 로 바꾸고, **Output Directory** 에 수동 설정(`public` 등)이
  있으면 **Override 를 꺼서 비우세요.**
- **리포트가 안 바뀌어요.** ① GitHub repo에 최신 `.md` 가 올라갔는지, ② Vercel
  Deployments에 새 빌드가 생겼는지 순서대로 확인하세요. launchd push가 안 됐다면
  웹페이지도 갱신되지 않습니다(`scripts/push.log` 확인).
- **로컬에서 미리 보고 싶어요.**
  ```bash
  cd ~/Documents/GitHub/stock-plan
  npm install
  npm run dev      # http://localhost:3000
  ```
