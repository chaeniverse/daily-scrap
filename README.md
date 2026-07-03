##
# daily-scrap

'채'를 위한 매일 자동 갱신 투자 브리핑. 테크/AI·증시 요약과 월 150만원 포트폴리오 설계 예시를
매일 생성하고, 웹에서 볼 수 있게 보여줍니다.

## 동작 흐름

1. **리포트 생성** — Cowork 예약 작업이 매일 오전 `stock-report/{날짜} stock report.md` 를 생성/갱신
   (한 주에 파일 하나, 매일 덮어쓰기).
2. **자동 push** — mac의 launchd가 변경분을 GitHub로 commit + push (`scripts/` 참고).
3. **자동 배포** — Vercel이 push를 감지해 사이트를 재빌드 → `*.vercel.app` 에서 최신 리포트 확인.

## 웹사이트

`app/` 의 Next.js(App Router) 사이트가 `stock-report/*.md` 를 빌드 시점에 읽어
최신 리포트와 지난 리포트 아카이브를 보여줍니다.

```bash
npm install
npm run dev      # http://localhost:3000 에서 미리보기
```

## 문서

- `scripts/VERCEL-SETUP.md` — Vercel 연결/배포 가이드 (한 번만 설정).
- `scripts/SETUP.md` — launchd 자동 push 설정 가이드.

> ⚠️ 리포트는 투자 자문이 아니라 참고용 정보입니다. 모든 투자에는 원금 손실 위험이 있습니다.
